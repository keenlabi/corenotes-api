import { Request, Response } from "express"
import UserModel from "@user/models/user.model"
import { hashPassword } from "@services/security/password";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";

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
            sendSuccessResponse({res, statusCode: 200, message: "Staff user has been updated successfully",  data:{}})
        })
        .catch((error)=> {
            // TODO: return error if validation is failed
            console.log(`USER UPDATE ERROR: There was an error changing staff user password`)
            console.log(error)
            sendFailureResponse({res, statusCode: 500, message:"There was an error updating staff password"});
        })
    })
}