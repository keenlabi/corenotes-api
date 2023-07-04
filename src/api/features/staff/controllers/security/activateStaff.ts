import { Request, Response } from "express"
import UserModel from "@user/models/user.model"
import { verifyPassword } from "@services/security/password"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import { getStaffUserByUserId } from "@services/db/staff.service"
import { IStaffDocument } from "@staff/model/types"
import { NotAuthorizedError } from "@globals/server/Error"
import activateStaffUser from "@staff/services/activateStaffUser"

export default function activateStaff(req:Request, res:Response) {

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

            activateStaffUser(parseInt(req.params.staffId))
            .then((deactivatedStaff:IStaffDocument)=> {

                console.log("Staff has been activated successfully")
                return sendSuccessResponse({
                    res, 
                    statusCode: 200, 
                    message: "Staff account has been activated successfully",  
                    data: { staff: deactivatedStaff }
                })
            })
            .catch((error)=> {
                console.log(`USER UPDATE ERROR: There was an error activating staff account`)
                console.log(error)
                sendFailureResponse({res,statusCode:500, message: "There was an error activating staff"});
            })
        })
        .catch((error)=> {
            console.log(`There was an error activating`)
            console.log(error)
            sendFailureResponse({res,statusCode:500, message: "There was an error activating staff"});
        })
    })
    .catch((error)=> {
        console.log(`There was an error activating staff`)
        console.log(error)
        sendFailureResponse({res,statusCode:500, message: "There was an error activating staff"});
    })
}