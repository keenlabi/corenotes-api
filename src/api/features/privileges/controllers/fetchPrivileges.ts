import { Request, Response } from "express";
import fetchAllPrivileges from "../services/fetchAllPrivileges";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { ServerError } from "@globals/server/Error";

export default function fetchPrivileges(req:Request, res:Response) {
    fetchAllPrivileges(parseInt(req.params.pageNumber))
    .then((response)=> {
        return sendSuccessResponse({ 
            res, 
            statusCode: 200,
            message: "Privileges retrieved successfully",
            data: response
        })
    })
    .catch((error)=> {
        
        console.log("There was an error fetching all privileges");
        console.log(error)

        const serverError = new ServerError();
        return sendFailureResponse({
            res,
            statusCode: serverError.statusCode,
            message: serverError.message
        })
    })
}