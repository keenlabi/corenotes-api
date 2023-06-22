import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { IUser } from "@user/models/types";
import userModel from "@user/models/user.model";
import { Request, Response } from "express"

export default function fetchStaffDocuments(req:Request, res:Response) {

    const query = { _id: req.params.staffId }
    
    userModel
    .findOne(query)
    .then(({documents}:IUser)=> {
        const documentsCount = documents.length;

        const pageNumber = parseInt(req.params.pageNumber) - 1 || 0;
        const resultsPerPage = 10;
        const resultOffset = (resultsPerPage) * pageNumber;
        const resultsLimit = resultsPerPage + resultOffset;
        const totalPages = Math.ceil(documentsCount / resultsPerPage);

        const documentsToReturn = documents.reverse().slice(resultOffset, resultsLimit)

        return sendSuccessResponse({res, statusCode: 200, message: "Staff documents retrieved successfully", data: { 
            currentPage: pageNumber + 1,
            totalPages: totalPages,
            documents: documentsToReturn
        }})
    })
    .catch(()=> {
        return sendFailureResponse({res, statusCode: 200, message: "There was an error fetching staff documents"})
    })
}