import { Request, Response } from "express"
import { UserModel } from "api/v1/models";
import { hashPassword } from "api/v1/utils/authUtils/security/password";
import { sendFailureResponse, sendSuccessResponse } from "api/v1/utils/serverUtils/response";

export default function resetStaffPassword(req:Request, res:Response) {
    const newPassword = req.body.newPassword;

    hashPassword(newPassword)
    .then((hashedPassword)=> {
        const query = { _id: req.params.staffId }

        UserModel.findOneAndUpdate(
            query,
            {
                $set: {
                    password: hashedPassword
                }
            }
        ).then(()=> {
            console.log("STAFF's password has been updated successfully")
            sendSuccessResponse(res, 200, "Staff user has been updated successfully",  {})
        })
        .catch((error)=> {
            // TODO: return error if validation is failed
            console.log(`USER UPDATE ERROR: There was an error changing staff user password`)
            console.log(error)
            sendFailureResponse(res, 500, "There was an error updating staff password");
        })
    })
}