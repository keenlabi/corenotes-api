import { Request, Response } from "express"
import { UserModel } from "../../models";
import { IUser } from "../../models/UserModel/types";
import { sendFailureResponse, sendSuccessResponse } from "../../utils/serverUtils/response";

export default function fetchStaffs(req:Request, res:Response) {
    const   pageNumber = parseInt(req.params.pageNumber) - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * pageNumber;

    UserModel.find()
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
            return sendSuccessResponse(res, 200, "Staffs list retrieved successfully", { 
                currentPage: parseInt(req.params.pageNumber), 
                totalPages: totalPageNumber,
                staffs: filteredFormatStaff
            })
        })
    })
    .catch(()=> {
        return sendFailureResponse(res, 200, "There was an error fetching staff list")
    })
}