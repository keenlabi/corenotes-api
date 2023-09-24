import extractDateFromISODateTime from "@globals/helpers/dateTime/extractDateFromISODateTime";
import extractTimeFromISODateTime from "@globals/helpers/dateTime/extractTimeFromISODateTime";
import { sendAuthorizationFailureResponse, sendNotFoundFailureResponse, sendServerFailureResponse, sendSuccessResponse, sendValidationFailureResponse } from "@globals/server/serverResponse";
import { getStaffRoleById, getStaffUserById } from "@services/db/staff.service";
import clockStaffInByObjId from "@staff/services/shifts/clockStaffIn";
import fetchStaffShiftByDateAndStaffRef from "@staff/services/shifts/fetchStaffShiftByDate";
import { Request, Response } from "express";

export default function getClockIn(req:Request, res:Response) {
    const validationResult = validateGetClockInRequestBody(req.body);
    if(validationResult.error) return sendValidationFailureResponse(res, validationResult.message);

    getStaffUserById(req.currentUser.id!)
    .then((foundStaff)=> {
        if(!foundStaff) return sendNotFoundFailureResponse(res, "No record found for staff")

        const requestDate = extractDateFromISODateTime(req.body.startAt);
        console.log(requestDate)
        fetchStaffShiftByDateAndStaffRef(foundStaff.id, requestDate)
        .then((foundStaffShift)=> {
            if(!foundStaffShift) return sendNotFoundFailureResponse(res, "No schedule found for today")

            const currentStartTime = {
                hr: parseInt(extractTimeFromISODateTime(req.body.startAt).split(":")[0]) + 1,
                min: parseInt(extractTimeFromISODateTime(req.body.startAt).split(":")[1])
            }
            const scheduleStartTime = {
                hr: parseInt(foundStaffShift!.schedule.startTime.split(":")[0]),
                min: parseInt(foundStaffShift!.schedule.startTime.split(":")[1])
            };
            const scheduleEndTime = {
                hr: parseInt(foundStaffShift!.schedule.endTime.split(":")[0]),
                min: parseInt(foundStaffShift!.schedule.endTime.split(":")[1])
            }

            console.log(foundStaffShift.schedule)
            console.log(currentStartTime)
            console.log(scheduleStartTime)
            console.log(scheduleEndTime)

            if(scheduleStartTime.hr > currentStartTime.hr) return sendAuthorizationFailureResponse(res, "Clock in request rejected, your shift hasn't begun");
            if(scheduleStartTime.hr === currentStartTime.hr) {
                if(scheduleStartTime.min > currentStartTime.min) return sendAuthorizationFailureResponse(res, "Clock in request rejected, your shift hasn't begun");
            }

            if(scheduleEndTime.hr < currentStartTime.hr) return sendAuthorizationFailureResponse(res, "Clock in request rejected, your shift has ended");
            if(scheduleEndTime.hr === currentStartTime.hr)  {
                if(scheduleEndTime.min < currentStartTime.min) return sendAuthorizationFailureResponse(res, "Clock in request rejected, your shift has ended");
            }

            
            clockStaffInByObjId(foundStaff!.id)
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
    startAt:string;
    endAt:string;
}

function validateGetClockInRequestBody(data:IGetClockInRequestBody) {
    if(!Object.keys(data).length) return { error: true, message: "Please send in the required data" };
    if(!data.startAt) return { error: true, message: "'StartAt' field cannot be empty" };
    
    return { error: false, message: "" };
}