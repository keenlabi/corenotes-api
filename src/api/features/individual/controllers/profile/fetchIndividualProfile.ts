import { ServerError } from "@globals/server/Error"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import { getIndividualByIndividualId } from "@services/db/individual.service"
import { Request, Response } from "express"

export default function fetchIndividualProfile(req:Request, res:Response) {
    getIndividualByIndividualId(parseInt(req.params.individualId))
    .then((foundIndividual)=> {

        return sendSuccessResponse({
            res, 
            statusCode: 200, 
            message: "Individual profile retrieved successfully", 
            data: { 
                individual: foundIndividual
            }
        })  
    })
    .catch((error)=> {
        
        console.log("There was an error fetching individual profile: ", error);

        const serverError = new ServerError();
        return sendFailureResponse({
            res, 
            statusCode: serverError.statusCode, 
            message: "There was an error fetching individual profile"
        })
    })
}