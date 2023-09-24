import { sendNotFoundFailureResponse, sendServerFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { getStaffUserByStaffId } from "@services/db/staff.service";
import fetchStaffShifts from "@staff/services/shifts/fetchStaffShifts";
import { Request, Response } from "express";

export default function getNewShift(req:Request, res:Response) {
    getStaffUserByStaffId(parseInt(req.params.staffId))
    .then((foundStaff)=> {
        if(!foundStaff) return sendNotFoundFailureResponse(res, "Staff not found");

        fetchStaffShifts(foundStaff.id, parseInt(req.params.pageNumber))
        .then((response)=> {
            return sendSuccessResponse({ res, statusCode: 200, message:"Staff shifts retrieved successfully", data: response })
        })
        .catch((error)=> {
            console.log("There was an error fetching staff shifts", error);
            return sendServerFailureResponse(res, "There was a server error, please try again");
        })
    })
    .catch((error)=> {
        console.log("There was an error getting staff user by staff id", error);
        return sendServerFailureResponse(res, "There was a server error, please try again");
    })
}