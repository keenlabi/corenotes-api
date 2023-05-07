import { Request, Response } from "express"
import { UserModel } from "../../../models";
import { IUser } from "../../../models/UserModel/types";
import { sendFailureResponse, sendSuccessResponse } from "../../../utils/serverUtils/response";

export default function fetchStaffDocuments(req:Request, res:Response) {

    const query = { _id: req.params.staffId }
    
    UserModel
    .findOne(query)
    .then(({documents}:IUser)=> {
        const documentsCount = documents.length;

        const pageNumber = parseInt(req.params.pageNumber) - 1 || 0;
        const resultsPerPage = 10;
        const resultOffset = (resultsPerPage) * pageNumber;
        const resultsLimit = resultsPerPage + resultOffset;
        const totalPages = Math.ceil(documentsCount / resultsPerPage);

        const documentsToReturn = documents.reverse().slice(resultOffset, resultsLimit)

        console.log(documentsToReturn.length)

        return sendSuccessResponse(res, 200, "Staff documents retrieved successfully", { 
            currentPage: pageNumber + 1,
            totalPages: totalPages,
            documents: documentsToReturn
        })
    })
    .catch(()=> {
        return sendFailureResponse(res, 200, "There was an error fetching staff documents")
    })
}