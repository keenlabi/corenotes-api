import { sendNotFoundFailureResponse, sendServerFailureResponse, sendValidationFailureResponse } from "@globals/server/serverResponse";
import { getStaffUserByStaffId } from "@services/db/staff.service";
import createStaffShift from "@staff/services/shifts/createStaffShifts";
import { Request, Response } from "express";

export default function postNewShift(req:Request, res:Response) {
    const validationResult = validatePostNewShiftRequestBody(req.body);
    if(validationResult.error) return sendValidationFailureResponse(res, validationResult.message);

    getStaffUserByStaffId(parseInt(req.params.staffId))
    .then((foundStaff)=> {
        if(!foundStaff) return sendNotFoundFailureResponse(res, "Staff not found");

        const newShiftDetails = {
            staffObjId: foundStaff.id,
            startAt: req.body.startAt,
            endAt: req.body.endAt    
        }
        
        createStaffShift(newShiftDetails)
        .then(()=> {
            
        })
        .catch((error)=> {
            console.log("There was an error creating new staff shift schedule", error);
            return sendServerFailureResponse(res, "There was a server error, please try again")
        })
    })
    .catch((error)=> {
        console.log("There was an error finding staff with staff Id", error);
        return sendServerFailureResponse(res, "There was a server error, please try again")
    })
}

interface IPostNewShiftRequestBody {
    startAt:string;
    endAt:string;
}

function validatePostNewShiftRequestBody(data:IPostNewShiftRequestBody) {
    if(!Object.keys(data).length) return { error: true, message: "Please send in the required data" };
    if(!data.startAt) return { error: true, message: "'StartAt' field cannot be empty" };
    if(!data.endAt) return { error: true, message: "'EndAt' field cannot be empty" };
    
    return { error: false, message: "" };
}