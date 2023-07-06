import { Request, Response } from "express"
import { sendFailureResponse, sendSuccessResponse } from "src/api/shared/globals/server/serverResponse";
import userModel from "../models/user.model";
import staffModel from "@staff/model/staff.model";
import { IStaffDocument } from "@staff/model/types";
import { getStaffRoleById } from "@services/db/staff.service";

export default function fetchProfile (req:Request, res:Response) {
    
    const query = { _id: req.params.userId || req.currentUser.id };

    userModel.findOne(query)
    .then((foundUser)=> {
        if(!foundUser) return sendFailureResponse({res, statusCode: 404, message: "User profile doesn't exist"});

        staffModel.findOne({ _id: foundUser.staff  })
        .then(async (foundStaff:IStaffDocument)=> {
            
            const staffRole = await getStaffRoleById(foundStaff.providerRole)

            const user = {
                id: foundUser.id,
                active: foundUser.active,
                role: {
                    title: staffRole.title,
                    privileges: staffRole.privileges
                },
                lastSeen: foundUser.lastSeen,
                firstname: foundStaff.firstname,
                lastname: foundStaff.lastname,
                profileImage: foundStaff.profileImage,
            }

            sendSuccessResponse({
                res, 
                statusCode: 200, 
                message: "User retrieved successfully", 
                data: { user }
            });  
        })
    })
    .catch((error)=> {
        console.log(error);
        sendFailureResponse({res, statusCode: 401, message: "Error retrieving user"});
    });
}