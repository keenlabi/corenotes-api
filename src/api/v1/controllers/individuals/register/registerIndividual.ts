import { Request, Response  } from "express"
import validateRegisterIndividual from "./validateRegisterIndividual"
import { validateRegisterIndividualRequestBodyType } from "./types";
import { UserModel } from "../../../models";
import { sendFailureResponse, sendSuccessResponse } from "../../../utils/serverUtils/response";
import fetchIndividuals from "../fetchIndividuals";

export default function registerIndividual (req:Request, res:Response) {
    validateRegisterIndividual({...req.body, ...req.file})
    .then(({ requestBody }:validateRegisterIndividualRequestBodyType) => {    
        
        console.log(requestBody)

        UserModel.create({
            role:'INDIVIDUAL',

            firstname: requestBody.firstname,
            middlename: requestBody.middlename,
            lastname: requestBody.lastname,
            nickname: requestBody.nickname,

            dob: requestBody.dob,
            gender: requestBody.gender,
            religion: requestBody.religion,
           
            ssn: requestBody.ssn,
            contact: {
                name: requestBody.contact.name,
                email: requestBody.contact.email,
                phoneNumber: requestBody.contact.phoneNumber
            },
            weight: requestBody.weight,
            medicaidNumber: requestBody.medicaidNumber,
            maritalStatus: requestBody.maritalStatus,

            codeAlert: requestBody.codeAlert,
            requestedServices: requestBody.requestedServices,
            diet: requestBody.diet,
            allergies: {
                food: requestBody.allergies.food,
                med: requestBody.allergies.med,
                other: requestBody.allergies.other
            }
        })
        .then((user)=> {
            console.log(`REGISTRATION: New individual registered successfully`)
            fetchIndividuals(req, res)
            // sendSuccessResponse(res, 201, "New staff registered successfully", {})
        })
        .catch((error)=> {
            // console.log(`There was an error creating new individual: `, error);
            sendFailureResponse(res, 422, error.message ?? "There was an error creating new individual");
        });
    })
    .catch((error)=> {
        console.log(error)
        sendFailureResponse(res, 422, error.message ?? "There was an error creating new individual");
    })
}