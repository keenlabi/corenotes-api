import { Request, Response } from "express";
import { sendNotFoundFailureResponse, sendServerFailureResponse, sendSuccessResponse, sendValidationFailureResponse } from "@globals/server/serverResponse";
import getCompartmentByCompartmentId from "../services/db/getCompartmentByCompartmentId";
import fetchServicesByCompartmentObjId from "../../services/services/fetchServicesByCompartmentObjId";
import formatFetchServiceListResponse from "../../services/services/formatFetchServiceListResponse";

export default function fetchCompartmentServices(req:Request, res:Response) {
    if(!req.params.compartmentId) return sendValidationFailureResponse(res, "'compartmentId' parameter must be provider");

    getCompartmentByCompartmentId(parseInt(req.params.compartmentId))
    .then((foundCompartment)=> {
        if(!foundCompartment) return sendNotFoundFailureResponse(res, "Compartment not found");

        fetchServicesByCompartmentObjId(foundCompartment.id)
        .then((foundServices)=> {
            return sendSuccessResponse({ 
                res, 
                statusCode: 200, 
                message:"Compartment services retrieved successfully", 
                data: { compartmentServices: formatFetchServiceListResponse(foundServices) }
            })
        })
        .catch((error)=> {
            console.log("There was an error fetching compartment services", error);
            return sendServerFailureResponse(res, "There was an error retrieving compartment services");
        })
    })
    .catch((error)=> {
        console.log("There was an error fetching compartment", error)
        return sendServerFailureResponse(res, "There was an error fetching compartments")
    })
}