import compartmentModel from "../models/compartment.model";
import { ICreateCompRequestBody } from "./validateCreateCompartmentRequest";
import { ICompartment } from "../models/types";
import { ICompartmentFormat } from "./types";

export interface INewCompartmentData extends Omit<ICreateCompRequestBody, 'bgColor'|'labelColor'|'image'> {
    image:string,
    meta: {
        bgColor:string,
        labelColor:string
    }
}

export default function createNewCompartment(newCompartmentData:INewCompartmentData) {
    return new Promise<ICompartmentFormat>((resolve, reject)=> {

        compartmentModel.create(newCompartmentData)
        .then((createdCompartmentDocument:ICompartment)=> {

            const createdCompartment:ICompartmentFormat = Object.freeze({
                id: createdCompartmentDocument._id.toString(),
                compartmentId: createdCompartmentDocument.compartmentId,
                title: createdCompartmentDocument.title,
                image: createdCompartmentDocument.image,
                staffRoles: createdCompartmentDocument.staffRoles,
                assignedIndividuals: createdCompartmentDocument.assignedIndividuals,
                meta: createdCompartmentDocument.meta,
                createdAt: createdCompartmentDocument.createdAt.toString()
            })

            resolve(createdCompartment)
        })
        .catch((error)=> reject(error))
    })
}