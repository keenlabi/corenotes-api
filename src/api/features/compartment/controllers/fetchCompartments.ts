import { Request, Response } from "express";
import fetchAllCompartments from "../services/fetchAllCompartments";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";

export default function fetchCompartments(req:Request, res:Response) {
    fetchAllCompartments(parseInt(req.params.pageNumber) ?? 1)
    .then((paginatedCompartments)=> {
        sendSuccessResponse({ 
            res,
            statusCode: 200, 
            message:"Compartments retrieved successfully", 
            data: { compartments: paginatedCompartments } 
        });
    })
    .catch((error)=> {
        console.log('There was an error fetching all compartments')
        console.log(error)
        sendFailureResponse({ res, statusCode: 500, message: "There was a server error, not your fault, we're on it"});
    })
}