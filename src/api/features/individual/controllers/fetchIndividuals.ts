import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import userModel from "@user/models/user.model";
import { Request, Response } from "express";
import fetchCompartment from "../../compartment/services/fetchCompartment";
import { getCompartmentById } from "@services/db/compartment.service";

export default function fetchIndividuals(req:Request, res:Response) {

    const   pageNumber = parseInt(req.params.pageNumber) - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * pageNumber;

    const query = { role: 'INDIVIDUAL' }

    userModel.find(query)
    .skip(pageOffset)
    .limit(resultsPerPage)
    .sort({ createdAt: -1 })
    .then(async (foundIndividuals)=> {
        
        const mappedIndividuals = [];

        for await ( const individual of foundIndividuals ) {
            mappedIndividuals.push({
                id:individual._id,
                profileImage: individual.profileImage,
                firstName: individual.firstname,
                lastName: individual.lastname,
                dob: individual.dob,
                gender: individual.gender,
                compartment: (await getCompartmentById(individual.compartment)).title,
                medicaidNumber: individual.medicaidNumber
            })
        }

        return sendSuccessResponse({res, statusCode:200, message: "Individuals retrieved successfully", data: { individuals: mappedIndividuals }})
    })
    .catch((error)=> {
        console.log(`USER FETCH ERROR: There was an error retrieving individuals. `, error)
        return sendFailureResponse({res, statusCode: 500, message:"There was an error retrieving individuals"});
    })
}