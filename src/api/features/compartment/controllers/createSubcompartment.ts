import { Request, Response } from "express"
import { sendConflictFailureResponse, sendFailureResponse, sendServerFailureResponse, sendSuccessResponse, sendValidationFailureResponse } from "@globals/server/serverResponse"
import fetchCompartment from "../services/fetchCompartment"
import findSubCompartmentByTitle from "../services/findSubCompartmentByTitle";
import createNewSubcompartment from "../services/createNewSubcompartment";

export default function createSubcompartment(req:Request, res:Response) {

    const validationResult = validateCreateSubcompartmentRequest({ ...req.params, ...req.body});
    if(validationResult.error) return sendValidationFailureResponse(res, validationResult.message);

    const newCompartmentData = {
        title: validationResult.data!.title,
    }

    findSubCompartmentByTitle(parseInt(validationResult.data!.compartmentId), validationResult.data!.title)
    .then((foundSubcompartment)=> {
        console.log(foundSubcompartment)
        if(foundSubcompartment) return sendConflictFailureResponse(res, `Sub compartment with title "${foundSubcompartment.title}" already exists`);

        createNewSubcompartment(validationResult.data!.compartmentId, newCompartmentData)
        .then((updatedCompartment)=> {
            fetchCompartment(updatedCompartment!.compartmentId)
            .then((foundCompartment)=> {
                sendSuccessResponse({
                    res, 
                    statusCode: 200, 
                    message:"Compartment details retrieved successfully",
                    data: { compartment: foundCompartment }
                })
            })
            .catch((error)=> {
                console.log("There was an error fetching compartment: ", error)
                return sendServerFailureResponse(res, "")
            })
        })
        .catch((error)=> {
            console.log('CREATE SUB COMPARTMENT: There was an error creating compartments')
            console.log(error)
            return sendFailureResponse({ res, statusCode: 500, message:"There was a validation error" })
        })
    })
}

export interface ICreateCompRequestBody {
    compartmentId:string;
    title:string;
}

function validateCreateSubcompartmentRequest(data:ICreateCompRequestBody) {
    // check if any field is empty and return error if true
    if(Object.keys(data).length === 0) return ({ error:true, message:'Input fields cannot be empty' });

    if(!data.compartmentId) return ({ error:true, message:'Compartment Id parameter cannot be empty' });
    if(!data.title) return ({ error:true, message:'Title field cannot be empty' });

    const compartmentData:ICreateCompRequestBody = Object.freeze({
        compartmentId: data.compartmentId,
        title: data.title.toLowerCase()
    })

    // return success if true
    return({ error:false, message:'Input fields cannot be empty', data: compartmentData });
}