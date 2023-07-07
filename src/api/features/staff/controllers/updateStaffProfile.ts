import { NotFoundError, ServerError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import updateStaffProfileByStaffId from "@staff/services/db/updateStaffProfileByStaffId";
import { Request, Response } from "express";

export default function updateStaffProfile(req:Request, res:Response) {
    
    const updateProps = {
        providerRole: req.body.providerRole
    }

    updateStaffProfileByStaffId(req.body.staffId, updateProps)
    .then((updatedStaff)=> {
        if(!updatedStaff) {
            const notFoundError = new NotFoundError("Staff profile not found");
            return sendFailureResponse({
                res,
                statusCode: notFoundError.statusCode,
                message: notFoundError.message
            })
        }

        return sendSuccessResponse({
            res,
            statusCode: 200,
            message: "Staff profile has been updated successfully",
            data: {
                staff: (updatedStaff)
            }
        })
    })
    .catch(()=> {
        const serverError = new ServerError();
        return sendFailureResponse({
            res,
            statusCode: serverError.statusCode,
            message: serverError.message
        })
    })
}