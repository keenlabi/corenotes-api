import staffModel from "@staff/model/staff.model";
import { Request, Response } from "express";
import { ILogOutRequestBodyType, IValidateLogOutRequestBodyType } from "./types";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";

export default function logout(req:Request, res:Response) {
    validateLogOutRequestBody(req.body)
    .then((requestBody)=> {

        const query = { _id: req.currentUser.id }
        const updateObj = { $set: { accessToken: "" } }
    
        staffModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((foundStaff) => {
            if(!foundStaff) {
                return sendFailureResponse({ res, statusCode: 404, message: "Staff user not found" });
            }

            res.clearCookie("sid");
            console.log(`Staff user ${foundStaff.id} has been logged out successfully`);
            return sendSuccessResponse({
                res,
                statusCode: 200,
                message: "User was successly logged out",
            });
        })
    })
    .catch((error)=> {
        console.log("There was an error logging user out: ", error);
        return sendFailureResponse({ res, statusCode: 500, message: error });
    })
}

function validateLogOutRequestBody(data:ILogOutRequestBodyType) {
    return new Promise<IValidateLogOutRequestBodyType>(async (resolve, reject)=> {

        // check if any field is empty and return error if true
        // if(Object.keys(data).length === 0) reject({ status: false, code: 422, message:'Input field cannot be empty' })
        
        // check if email is registered already and return error if true
        // if(!data.latitude ) reject({ status: false, code: 422,  message:'latitude field cannot be empty' });

        // check if password field is empty, check if password is at least characters long
        // if(!data.longitude) reject({status:false, code:422, message: 'longitude field cannot be empty'});

        // return success if true
        resolve({ status:true, code:200, message: 'SUCCESS', requestBody: data });
    })
}