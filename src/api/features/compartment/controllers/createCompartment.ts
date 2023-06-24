import { Request, Response } from "express"
import validateCreateCompartmentRequest, { ICreateCompRequestBody } from "../services/validateCreateCompartmentRequest"
import createNewCompartment, { INewCompartmentData } from "../services/createNewCompartment"
import { sendFailureResponse } from "@globals/server/serverResponse"
import fetchCompartments from "./fetchCompartments"
import uploadFileToCloud from "@services/fileSystem/uploadFileToCloud"

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
                assignedIndividuals: data.assignedIndividuals,
                meta: {
                    bgColor: data.bgColor,
                    labelColor: data.labelColor
                }
            })

            createNewCompartment(newCompartmentData)
            .then(()=> fetchCompartments(req, res))
            .catch((error)=> {
                console.log('CREATE COMPARTMENT: There was an error creating compartments')
                console.log(error)
                sendFailureResponse({ res, statusCode: 500, message:"There was a validation error" })
            })
        })
    })
    .catch((error)=> {
        console.log('VALIDATION ERROR: There was an error validating create compartment request body')
        console.log(error)
        sendFailureResponse({ res, statusCode: 500, message:"There was a validation error" })
    })
}