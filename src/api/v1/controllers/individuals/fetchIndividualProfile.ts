import { Request, Response } from "express"
import { UserModel } from "../../models"
import { sendFailureResponse, sendSuccessResponse } from "../../utils/serverUtils/response"

export default function fetchIndividualProfile(req:Request, res:Response) {

    const query = { _id: req.params.id }

    UserModel
    .findOne(query)
    .lean()
    .then((foundIndividual:any)=> {
        
        const { password, accessToken, createdAt, ...filteredFoundIndividual } = foundIndividual 

        return sendSuccessResponse(res, 200, "Individual profile retrieved successfully", { 
            individual: filteredFoundIndividual
        })
    })
    .catch(()=> {
        return sendFailureResponse(res, 200, "There was an error fetching individual profile")
    })
}