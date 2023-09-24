import { Request, Response } from "express"
import { verifyPassword } from "src/api/shared/services/security/password"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import { IStaffDocument } from "@staff/model/types"
import { getStaffUserById, getStaffUserByUserId } from "src/api/shared/services/db/staff.service"
import { NotAuthorizedError } from "@globals/server/Error"
import deactivateStaffUser from "@staff/services/deactivateStaff"

export default function deactivateStaff(req:Request, res:Response) {

    getStaffUserByUserId(req.currentUser.id!)
    .then((foundStaff:IStaffDocument)=> {
    
        verifyPassword(req.body.password, foundStaff.password!)
        .then((isVerified:boolean)=> {
             
            if(!isVerified) {
                const notAuthorizedError = new NotAuthorizedError('The password entered does not match our record. Please confirm and try again.');
                return sendFailureResponse({
                    res, 
                    statusCode: notAuthorizedError.statusCode, 
                    message: notAuthorizedError.message
                });
            }

            deactivateStaffUser(parseInt(req.params.staffId))
            .then((deactivatedStaff:IStaffDocument)=> {

                console.log("Staff has been deactivated successfully")
                return sendSuccessResponse({
                    res, 
                    statusCode: 200, 
                    message: "Staff account has been deactivated successfully",  
                    data: { staff: deactivatedStaff }
                })
            })
            .catch((error)=> {
                console.log(`USER UPDATE ERROR: There was an error deactivating staff account`)
                console.log(error)
                sendFailureResponse({res,statusCode:500, message: "There was an error deactivating staff"});
            })
        })
        .catch((error)=> {
            console.log(`There was an error deactivating`)
            console.log(error)
            sendFailureResponse({res,statusCode:500, message: "There was an error deactivating staff"});
        })
    })
    .catch((error)=> {
        console.log(`There was an error deactivating staff`)
        console.log(error)
        sendFailureResponse({res,statusCode:500, message: "There was an error deactivating staff"});
    })
}