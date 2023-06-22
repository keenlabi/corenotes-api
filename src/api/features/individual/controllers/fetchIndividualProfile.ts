import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import userModel from "@user/models/user.model"
import { Request, Response } from "express"


export default function fetchIndividualProfile(req:Request, res:Response) {

    const query = { _id: req.params.id }

    userModel
    .findOne(query)
    .lean()
    .then((foundIndividual:any)=> {
        
        const { password, accessToken, createdAt, ...filteredFoundIndividual } = foundIndividual 

        return sendSuccessResponse({res, statusCode: 200, message: "Individual profile retrieved successfully", data: { 
            individual: filteredFoundIndividual
        }})
    })
    .catch(()=> {
        return sendFailureResponse({res, statusCode:200, message: "There was an error fetching individual profile"})
    })
}