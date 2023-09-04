import { NotFoundError } from "@globals/server/Error";
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import { getIndividualsByMedicationObjectId } from "@services/db/individual.service";
import { getMedicationByMedicationId } from "@services/db/medication.service";
import { Request, Response } from "express";
import getServiceByServiceId from "../../services/services/db/getServiceByServiceId";
import { IIndividualListItem } from "@individual/services/fetchAllServices";
import calcAge from "@globals/helpers/calcAge";

export default function fetchMedicationIndividuals(req:Request, res:Response) {
    getMedicationByMedicationId(parseInt(req.params.medicationId))
    .then((foundMedication)=> {
        if(!foundMedication) {
            const notFoundError = new NotFoundError("Medication not found");
            return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message })
        }

        getServiceByServiceId(req.body.serviceId)
        .then((foundService)=> {

            if(!foundService) {
                const notFoundError = new NotFoundError("Service not found");
                return sendFailureResponse({ res, statusCode: notFoundError.statusCode, message: notFoundError.message })
            }

            getIndividualsByMedicationObjectId(foundMedication?._id.toString()!)
            .then(async (foundIndividuals)=> {

                const mappedIndividuals:Array<IIndividualListItem> = foundIndividuals.map(individual=> ({
                    id: individual._id.toString(),
                    individualId: individual.individualId,
                    profileImage: individual.profileImage,
                    firstname: individual.firstname,
                    lastname: individual.lastname,
                    age: calcAge(individual.dob),
                    gender: individual.gender,
                    compartment: individual.compartment,
                    medicaidNumber: individual.medicaidNumber,
                }));

                return sendSuccessResponse({
                    res,
                    statusCode: 200,
                    message: "Medications individuals retrieved successfully",
                    data: {
                        individuals: mappedIndividuals
                    }
                })

            })
            .catch((error)=> {
                return  sendFailureResponse ({
                    res, 
                    statusCode: error.statusCode, 
                    message: error.message
                })
            })
        })
        .catch((error)=> {
            return  sendFailureResponse ({
                res, 
                statusCode: error.statusCode, 
                message: error.message
            })
        })
    })
    .catch((error)=> {
        return  sendFailureResponse ({
                    res, 
                    statusCode: error.statusCode, 
                    message: error.message
                })
    })
}