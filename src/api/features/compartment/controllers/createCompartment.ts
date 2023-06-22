import { Request, Response } from "express"
import validateCreateCompartmentRequest, { ICreateCompRequestBody } from "../services/validateCreateCompartmentRequest"
import createNewCompartment, { INewCompartment } from "../services/createNewCompartment"
import { sendFailureResponse } from "@globals/server/serverResponse"
import fetchCompartments from "./fetchCompartments"
import uploadFileToCloud from "@services/fileSystem/uploadFileToCloud"

export default function createCompartment(req:Request, res:Response) {

    const requestBody:ICreateCompRequestBody = {
        ...req.body, 
        image: req.file
    }

    validateCreateCompartmentRequest(requestBody)
    .then((data)=> {
        uploadFileToCloud(requestBody.image, 'Compartments')
        .then((fileURL)=> {
            
            const newData:INewCompartment = { ...data, image: fileURL }

            createNewCompartment(newData)
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
        sendFailureResponse({ res, statusCode: 500, message:"There was a validation error" })
    })
}