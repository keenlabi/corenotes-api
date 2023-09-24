import { Request, Response } from "express"
import validateCreateCompartmentRequest, { ICreateCompRequestBody } from "../services/validateCreateCompartmentRequest"
import createNewCompartment, { INewCompartmentData } from "../services/createNewCompartment"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import uploadFileToCloud from "src/api/shared/services/fileSystem/uploadFileToCloud"
import fetchAllCompartments from "../services/fetchAllCompartments"

export default function createCompartment(req:Request, res:Response) {

    const requestBody:ICreateCompRequestBody = { ...req.body, image: req.file }  

    validateCreateCompartmentRequest(requestBody)
    .then((data)=> {
        uploadFileToCloud(requestBody.image, 'Compartments')
        .then((fileURL)=> {
            
            const newCompartmentData:INewCompartmentData = Object.freeze({
                title: data.title,
                image: fileURL,
                staffRoles: data.staffRoles,
                // assignedIndividuals: data.assignedIndividuals,
                // meta: {
                //     bgColor: data.bgColor,
                //     labelColor: data.labelColor
                // }
            })

            createNewCompartment(newCompartmentData)
            .then(()=> {
                fetchAllCompartments(parseInt(req.params.pageNumber) ?? 1)
                .then((paginatedCompartments)=> {
                    return sendSuccessResponse({ 
                        res,
                        statusCode: 200,
                        message:"Compartments retrieved successfully",
                        data: { compartments: paginatedCompartments }
                    });
                })
                .catch((error)=> {
                    console.log('There was an error fetching all compartments')
                    console.log(error)
                    return sendFailureResponse({ res, statusCode: 500, message: "There was a server error, not your fault, we're on it"});
                })
            })
            .catch((error)=> {
                console.log('CREATE COMPARTMENT: There was an error creating compartments')
                console.log(error)
                return sendFailureResponse({ res, statusCode: 500, message:"There was a validation error" })
            })
        })
    })
    .catch((error)=> {
        console.log('VALIDATION ERROR: There was an error validating create compartment request body')
        console.log(error)
        return sendFailureResponse({ res, statusCode: 500, message:"There was a validation error" })
    })
}