import { Request, Response } from "express"
import { UserModel } from "v1/models";
import { IUser } from "v1/models/UserModel/types";
import { sendFailureResponse, sendSuccessResponse } from "v1/utils/serverUtils/response";

export default function fetchStaffs(req:Request, res:Response) {
    const   pageNumber = parseInt(req.params.pageNumber) - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * pageNumber;

    UserModel.find()
    .skip(pageOffset)
    .limit(resultsPerPage)
    .sort({ createdAt: -1 })
    .then((foundStaffs:IUser[])=> {
        UserModel.count()
        .then((totalStaffCount:number)=> {
            const totalPageNumber = Math.ceil(totalStaffCount / resultsPerPage);
            console.log(totalPageNumber)
            return sendSuccessResponse(res, 200, "Staffs list retrieved successfully", { 
                currentPage: pageNumber, 
                totalPages: totalPageNumber,
                staffs: foundStaffs
            })
        })
    })
    .catch(()=> {
        return sendFailureResponse(res, 200, "There was an error fetching staff list")
    })
}