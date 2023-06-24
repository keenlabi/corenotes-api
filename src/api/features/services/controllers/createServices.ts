import { Request, Response } from "express"
import { sendFailureResponse } from "@globals/server/serverResponse"
import validateCreateServiceRequest from "../services/validateCreateServiceRequest"
import createNewService from "../services/createNewService"
import fetchServices from "./fetchServices"

export default function createService(req:Request, res:Response) {
    validateCreateServiceRequest(req.body)
    .then((data)=> {
        createNewService(data)
        .then(()=> fetchServices(req, res))
        .catch((error)=> {
            console.log('CREATE SERVICES: There was an error creating service')
            console.log(error)
            sendFailureResponse({ res, statusCode: 500, message:"There was an error creating new service" })
        })
    })
    .catch((error)=> {
        console.log('VALIDATION ERROR: There was an error validating create service request body')
        console.log(error)
        sendFailureResponse({ res, statusCode: 500, message:"There was a validation error" })
    })
}