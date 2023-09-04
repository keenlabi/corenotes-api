import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchAllIndividualDocuments from "@individual/services/documents/fetchAllIndividualDocuments";
import { Request, Response } from "express"

export default function fetchIndividualDocuments(req:Request, res:Response) {
    fetchAllIndividualDocuments(parseInt(req.params.staffId), parseInt(req.params.pageNumber))
    .then((response)=> {
        return sendSuccessResponse({
            res, 
            statusCode: 200, 
            message: "Individual documents retrieved successfully", 
            data: response
        })
    })
    .catch((error)=> {
        console.log("There was an error fetching individual documents: ", error)
        return sendFailureResponse({
            res, 
            statusCode: 200, 
            message: "There was an error fetching individual documents"
        })
    })
}