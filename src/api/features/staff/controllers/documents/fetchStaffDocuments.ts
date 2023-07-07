import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { getStaffUserByStaffId } from "@services/db/staff.service";
import { IStaffDocument } from "@staff/model/types";
import fetchAllStaffDocuments from "@staff/services/fetchAllStaffDocuments";
import { Request, Response } from "express"

export default function fetchStaffDocuments(req:Request, res:Response) {

    fetchAllStaffDocuments(parseInt(req.params.staffId), parseInt(req.params.pageNumber))
    .then((response)=> {
        return sendSuccessResponse({
            res, 
            statusCode: 200, 
            message: "Staff documents retrieved successfully", 
            data: response
        })
    })
    .catch((error)=> {
        console.log("There was an error fetching staff documents: ", error)
        return sendFailureResponse({
            res, 
            statusCode: 200, 
            message: "There was an error fetching staff documents"
        })
    })
}