import { Request, Response } from "express"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import fetchAllStaffs from "@staff/services/fetchAllStaffs";

export default function fetchStaffs(req:Request, res:Response) {
   fetchAllStaffs(parseInt(req.params.pageNumber))
   .then((staffs)=> {
          return sendSuccessResponse({ 
               res, 
               statusCode:200, 
               message:"Staffs retrieved successfully", 
               data:staffs 
          })
   })
   .catch(()=> {
          return sendFailureResponse({ 
               res, 
               statusCode: 500, 
               message: "There was an error fetching staff list" 
          })
   })
}