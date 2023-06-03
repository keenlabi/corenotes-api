import { Request, Response } from "express";
import { UserModel } from "../../models";
import { sendFailureResponse, sendSuccessResponse } from "../../utils/serverUtils/response";

export default function fetchIndividuals(req:Request, res:Response) {

    const   pageNumber = parseInt(req.params.pageNumber) - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * pageNumber;

    const query = { role: 'INDIVIDUAL' }

    UserModel.find(query)
    .skip(pageOffset)
    .limit(resultsPerPage)
    .sort({ createdAt: -1 })
    .then((foundIndividuals)=> {
        const mappedIndividuals = foundIndividuals.map( foundIndividual => ({
            id:foundIndividual._id,
            profileImage: foundIndividual.profileImage,
            firstName: foundIndividual.firstname,
            lastName: foundIndividual.lastname,
            dob: foundIndividual.dob,
            gender: foundIndividual.gender,
            compartment: foundIndividual.compartment,
            medicaidNumber: foundIndividual.medicaidNumber
        }))

        sendSuccessResponse(res, 200, "Individuals retrieved successfully", { individuals: mappedIndividuals })
    })
    .catch((error)=> {
        console.log(`USER FETCH ERROR: There was an error retrieving individuals. `, error)
        sendFailureResponse(res, 500, "There was an error retrieving individuals");
    })
}