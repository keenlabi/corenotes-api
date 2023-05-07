import { Request, Response } from "express"
import { UserModel } from "../../../models"
import { verifyPassword } from "../../../utils/authUtils/security/password"
import { sendFailureResponse, sendSuccessResponse } from "../../../utils/serverUtils/response"

export default function deactivateStaff(req:Request, res:Response) {

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
                        active: false
                    }
                },
                { new: true }
            ).then((updatedStaff)=> {
                console.log("Staff has been deactivated successfully")
                sendSuccessResponse(res, 200, "Staff account has been deactivated successfully",  { staff: updatedStaff })
            })
            .catch((error)=> {
                // TODO: return error if validation is failed
                console.log(`USER UPDATE ERROR: There was an error deactivating`)
                console.log(error)
                sendFailureResponse(res, 500, "There was an error deactivating staff");
            })
        })
        .catch((error)=> {

        })
    })
    .catch(()=> {
        console.log('DATABASE QUERY ERROR: There was an error finding your profile');
        sendFailureResponse(res, 200, "There was an error finding your profile")
    })
}