import { Request, Response } from "express"
import UserModel from "@user/models/user.model"
import { IUser } from "@user/models/types";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { getCompartmentById } from "@services/db/compartment.service";
import { getStaffRoleById } from "@services/db/staff.service";

interface staffList {
    id:string; 
    profileImage:string; 
    firstname:string; 
    lastname:string; 
    dob:string; 
    role:string;
    gender:string; 
    phoneNumber:string;
    lastSeen:Date;
}

export default function fetchStaffs(req:Request, res:Response) {
    const   pageNumber = parseInt(req.params.pageNumber) - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * pageNumber;

    const query = { role: 'STAFF' };

    UserModel.find(query)
    .skip(pageOffset)
    .limit(resultsPerPage)
    .sort({ createdAt: -1 })
    .then(async (foundStaffs:IUser[])=> {

        const mappedStaffs:Array<staffList>  = [];

        for await ( const staff of foundStaffs ) {
            mappedStaffs.push({
                id:staff._id.toString(),
                profileImage: staff.profileImage,
                firstname: staff.firstname,
                lastname: staff.lastname,
                dob: staff.dob,
                role: (await getStaffRoleById(staff.providerRole)).title,
                phoneNumber: staff.phoneNumber.work,
                gender: staff.gender,
                lastSeen: staff.lastSeen
            })
        }

        UserModel.count()
        .then((totalStaffCount:number)=> {
            const totalPageNumber = Math.ceil(totalStaffCount / resultsPerPage);
            return sendSuccessResponse({res, statusCode: 200, message: "Staffs list retrieved successfully", data: { 
                currentPage: parseInt(req.params.pageNumber), 
                totalPages: totalPageNumber,
                staffs: mappedStaffs
            }})
        })
    })
    .catch((error)=> {
        console.log(error)
        return sendFailureResponse({ res, statusCode: 500, message: "There was an error fetching staff list" })
    })
}