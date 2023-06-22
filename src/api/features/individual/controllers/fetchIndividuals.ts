import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse";
import userModel from "@user/models/user.model";
import { Request, Response } from "express";

export default function fetchIndividuals(req:Request, res:Response) {

    const   pageNumber = parseInt(req.params.pageNumber) - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * pageNumber;

    const query = { role: 'INDIVIDUAL' }

    userModel.find(query)
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

        sendSuccessResponse({res, statusCode:200, message: "Individuals retrieved successfully", data: { individuals: mappedIndividuals }})
    })
    .catch((error)=> {
        console.log(`USER FETCH ERROR: There was an error retrieving individuals. `, error)
        sendFailureResponse({res, statusCode: 500, message:"There was an error retrieving individuals"});
    })
}