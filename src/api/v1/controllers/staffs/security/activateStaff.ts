import { Request, Response } from "express"
import { UserModel } from "api/v1/models"
import { verifyPassword } from "api/v1/utils/authUtils/security/password"
import { sendFailureResponse, sendSuccessResponse } from "api/v1/utils/serverUtils/response"

export default function activateStaff(req:Request, res:Response) {

    const query = { _id: req.params.staffId }

    UserModel.findOne({_id: req.userId})
    .then((foundUser)=> {
        verifyPassword(req.body.password, foundUser.password)
        .then((isVerified)=> { 
            if(!isVerified) {
                return sendFailureResponse(res, 401, 'The password entered does not match our record. Please confirm and try again.');
            }
            
            UserModel.findOneAndUpdate(
                query,
                {
                    $set: {
                        active: true
                    }
                },
                { new: true }
            ).then((updatedStaff)=> {
                console.log("Staff has been activated successfully")
                sendSuccessResponse(res, 200, "Staff account has been activated successfully",  { staff: updatedStaff })
            })
            .catch((error)=> {
                // TODO: return error if validation is failed
                console.log(`USER UPDATE ERROR: There was an error activating`)
                console.log(error)
                sendFailureResponse(res, 500, "There was an error activating staff");
            })
        })
        .catch((error)=> {

        })
    })
    .catch(()=> {
        console.log('DATABASE QUERY ERROR: There was an error finding admin user profile');
        sendFailureResponse(res, 200, "There was an error finding admin user profile")
    })
}