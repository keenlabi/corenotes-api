import { Request, Response } from "express";
import { sendFailureResponse, sendNotFoundFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import getCompartmentByCompartmentId from "../services/db/getCompartmentByCompartmentId";
import { updateServiceCompartmentsById } from "@services/db/service.service";
import fetchServicesByCompartmentObjId from "../../services/services/fetchServicesByCompartmentObjId";
import formatFetchServiceListResponse from "../../services/services/formatFetchServiceListResponse";

export default function patchServiceToCompartment(req:Request, res:Response) {
    getCompartmentByCompartmentId(parseInt(req.params.compartmentId))
    .then((foundCompartment)=> {
        if(!foundCompartment) return sendNotFoundFailureResponse(res, "Compartment not found");

        updateServiceCompartmentsById(req.body.serviceId, foundCompartment!.id)
        .then(()=> {
            fetchServicesByCompartmentObjId(foundCompartment!.id)
            .then((services)=> {
                return sendSuccessResponse({
                    res,
                    statusCode: 200, 
                    message:"Service added to compartment successfully",
                    data: { compartmentServices: formatFetchServiceListResponse(services) }
                })
            })
        })
        .catch((error)=> {
            console.log("There was an error finding compartment")
            console.log(error)
            return sendFailureResponse({
                res,
                statusCode: 500,
                message:"There was an error finding compartment"
            })
        })
    })
}