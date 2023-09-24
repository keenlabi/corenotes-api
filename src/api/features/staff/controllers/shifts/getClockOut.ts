import extractDateFromISODateTime from "@globals/helpers/dateTime/extractDateFromISODateTime";
import extractTimeFromISODateTime from "@globals/helpers/dateTime/extractTimeFromISODateTime";
import { sendAuthorizationFailureResponse, sendNotFoundFailureResponse, sendServerFailureResponse, sendSuccessResponse, sendValidationFailureResponse } from "@globals/server/serverResponse";
import { getStaffRoleById, getStaffUserById } from "src/api/shared/services/db/staff.service";
import clockStaffInByObjId from "@staff/services/shifts/clockStaffIn";
import clockStaffOutByObjId from "@staff/services/shifts/clockStaffOut";
import fetchStaffShiftByDateAndStaffRef from "@staff/services/shifts/fetchStaffShiftByDate";
import { Request, Response } from "express";

export default function getClockOut(req:Request, res:Response) {
    const validationResult = validateGetClockInRequestBody(req.body);
    if(validationResult.error) return sendValidationFailureResponse(res, validationResult.message);

    getStaffUserById(req.currentUser.id!)
    .then((foundStaff)=> {
        if(!foundStaff) return sendNotFoundFailureResponse(res, "No record found for staff")

        const requestDate = extractDateFromISODateTime(req.body.endAt);

        fetchStaffShiftByDateAndStaffRef(foundStaff.id, requestDate)
        .then((foundStaffShift)=> {
            if(!foundStaffShift) return sendNotFoundFailureResponse(res, "No schedule found for today")

            const currentEndTime = {
                hr: parseInt(extractTimeFromISODateTime(req.body.endAt).split(":")[0]) + 1,
                min: parseInt(extractTimeFromISODateTime(req.body.endAt).split(":")[1])
            }

            const scheduleEndTime = {
                hr: parseInt(foundStaffShift!.schedule.endTime.split(":")[0]),
                min: parseInt(foundStaffShift!.schedule.endTime.split(":")[1])
            }

            if(scheduleEndTime.hr > currentEndTime.hr) return sendAuthorizationFailureResponse(res, "Clock out request rejected, your shift hasn't ended");
            if(scheduleEndTime.hr === currentEndTime.hr)  {
                if(scheduleEndTime.min > currentEndTime.min) return sendAuthorizationFailureResponse(res, "Clock out request rejected, your shift hasn't ended");
            }

            
            clockStaffOutByObjId(foundStaff!.id)
            .then(async(clockedInStaff)=> {
                const staffRole = await getStaffRoleById(clockedInStaff.providerRole)
                return sendSuccessResponse({res, statusCode: 200, message: "Staff clocked in successfully", data: { staff: {
                    id: foundStaff.id,
                    active: foundStaff.active,
                    isClockedIn: foundStaff.isClockedIn,
                    role: {
                        title: staffRole.title.toUpperCase(),
                        privileges: staffRole.privileges
                    },
                    lastSeen: foundStaff.lastSeen,
                    firstname: foundStaff.firstname,
                    lastname: foundStaff.lastname,
                    profileImage: foundStaff.profileImage,
                } } });
            })
            .catch((error)=> {
                console.log("There was an error clocking in", error);
                return sendServerFailureResponse(res, "There was an error clocking staff in");
            })
        })
        .catch((error)=> {
            console.log("There was an error clocking in", error);
            return sendServerFailureResponse(res, "There was an error clocking staff in");
        })
    })
    .catch((error)=> {
        console.log("There was an error clocking in", error);
        return sendServerFailureResponse(res, "There was an error clocking staff in");
    })
}

interface IGetClockInRequestBody {
    endAt:string;
}

function validateGetClockInRequestBody(data:IGetClockInRequestBody) {
    if(!Object.keys(data).length) return { error: true, message: "Please send in the required data" };
    if(!data.endAt) return { error: true, message: "'endAt' field cannot be empty" };
    
    return { error: false, message: "" };
}