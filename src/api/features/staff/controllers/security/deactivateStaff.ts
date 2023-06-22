import { Request, Response } from "express"
import UserModel from "@user/models/user.model"
import { verifyPassword } from "@services/security/password"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"

export default function deactivateStaff(req:Request, res:Response) {

    const query = { _id: req.params.staffId }

    UserModel.findOne({_id: req.currentUser.id})
    .then((foundUser)=> {
        verifyPassword(req.body.password, foundUser.password)
        .then((isVerified)=> { 
            if(!isVerified) {
                return sendFailureResponse({res, statusCode: 401, message: 'The password entered does not match our record. Please confirm and try again.'});
            }
            
            UserModel.findOneAndUpdate(
                query,
                {
                    $set: {
                        active: false
                    }
                },
                { new: true }
            ).then((updatedStaff)=> {
                console.log("Staff has been deactivated successfully")
                sendSuccessResponse({res, statusCode: 200, message: "Staff account has been deactivated successfully",  data: { staff: updatedStaff }})
            })
            .catch((error)=> {
                // TODO: return error if validation is failed
                console.log(`USER UPDATE ERROR: There was an error deactivating`)
                console.log(error)
                sendFailureResponse({res,statusCode:500, message: "There was an error deactivating staff"});
            })
        })
        .catch((error)=> {

        })
    })
    .catch(()=> {
        console.log('DATABASE QUERY ERROR: There was an error finding your profile');
        sendFailureResponse({res, statusCode: 200, message: "There was an error finding your profile"})
    })
}