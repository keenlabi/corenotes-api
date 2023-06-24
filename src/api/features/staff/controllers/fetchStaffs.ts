import { Request, Response } from "express"
import UserModel from "@user/models/user.model"
import { IUser } from "@user/models/types";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";

export default function fetchStaffs(req:Request, res:Response) {
    const   pageNumber = parseInt(req.params.pageNumber) - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * pageNumber;

    const query = { role: 'STAFF' }

    UserModel.find(query)
    .skip(pageOffset)
    .limit(resultsPerPage)
    .sort({ createdAt: -1 })
    .then(async (foundStaffs:IUser[])=> {
        let filteredFormatStaff:any[] = foundStaffs.map((staff)=> {
            return {
                id: staff.id,
                lastname: staff.lastname,
                firstname: staff.firstname,
                compartment: staff.compartment,
                role: staff.role,
                profileImage: staff.profileImage,
                phoneNumber: staff.phoneNumber.work
            }
        })

        UserModel.count()
        .then((totalStaffCount:number)=> {
            const totalPageNumber = Math.ceil(totalStaffCount / resultsPerPage);
            return sendSuccessResponse({res, statusCode: 200, message: "Staffs list retrieved successfully", data: { 
                currentPage: parseInt(req.params.pageNumber), 
                totalPages: totalPageNumber,
                staffs: filteredFormatStaff
            }})
        })
    })
    .catch(()=> {
        return sendFailureResponse({res, statusCode: 500, message: "There was an error fetching staff list"})
    })
}