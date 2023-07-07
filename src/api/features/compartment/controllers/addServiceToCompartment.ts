import { Request, Response } from "express";
import { addServiceIdToCompartment } from "../../services/services/addServiceIdToCompartment";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import getCompartmentByCompartmentId from "../services/db/getCompartmentByCompartmentId";
import { ConflictError } from "@globals/server/Error";

export default function addServiceToCompartment(req:Request, res:Response) {
    getCompartmentByCompartmentId(req.body.compartmentId)
    .then((foundCompartment)=> {
        if(foundCompartment.services.includes(req.body.serviceId)) {
            const conflictError = new ConflictError("Services has already been added to compartment");
            return sendFailureResponse({
                res,
                statusCode: conflictError.statusCode,
                message: conflictError.message
            })
        }

        addServiceIdToCompartment({ 
            compartmentObjectId: foundCompartment._id.toString(), 
            serviceObjectId: req.body.serviceId
        })
        .then(()=> {
            return sendSuccessResponse({
                res,
                statusCode: 200, 
                message:"Service added to compartment successfully",
                data: { compartment: foundCompartment }
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