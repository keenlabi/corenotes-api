import { Request, Response } from "express"
import UserModel from "@user/models/user.model"
import { IUser } from "@user/models/types";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { getCompartmentById } from "@services/db/compartment.service";

interface staffList {
    id: string; 
    profileImage: string; 
    firstname: string; 
    lastname: string; 
    dob: string; 
    role:string;
    gender: string; 
    phoneNumber:string;
    compartment: string; 
    medicaidNumber: Number
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
                role: staff.role,
                phoneNumber: staff.phoneNumber.work,
                gender: staff.gender,
                compartment: (await getCompartmentById(staff.compartment)).title,
                medicaidNumber: staff.medicaidNumber
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
    .catch(()=> {
        return sendFailureResponse({ res, statusCode: 500, message: "There was an error fetching staff list" })
    })
}