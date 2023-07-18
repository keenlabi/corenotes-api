import { NotFoundError } from "@globals/server/Error"
import getServiceByServiceId from "./db/getServiceByServiceId"
import individualModel from "@individual/models/individual.model";
import { getCompartmentById } from "@services/db/compartment.service";
import { IFetchIndividualResponse, IIndividualListItem } from "@individual/services/fetchAllServices";
import calcAge from "@globals/helpers/calcAge";

export default function getServiceIndividuals(serviceId:number, pageNumber:number){
    return new Promise<IFetchIndividualResponse>((resolve, reject)=> {
        getServiceByServiceId(serviceId)
        .then((foundService)=> {
            if(!foundService) {
                const notFoundError = new NotFoundError('No service found');
                reject(notFoundError)
            }

            const serviceObjectId = foundService!._id.toString();

            const   queryPageNumber = pageNumber - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * queryPageNumber;

            const individualsQuery = { active:true, 'services.serviceId': serviceObjectId }

            individualModel.find(individualsQuery)
            .then(async (foundIndividuals)=> {
                if(!foundIndividuals) {
                    const notFoundError = new NotFoundError('No individuals found');
                    reject(notFoundError)
                }

                const mappedIndividuals:IIndividualListItem[] = [];

                for await ( const individual of foundIndividuals ) {
                    mappedIndividuals.push({
                        id:individual._id,
                        individualId: individual.individualId,
                        profileImage: individual.profileImage,
                        firstname: individual.firstname,
                        lastname: individual.lastname,
                        age: calcAge(individual.dob),
                        gender: individual.gender,
                        compartment: (await getCompartmentById(individual.compartment)).title,
                        medicaidNumber: individual.medicaidNumber
                    })
                }

                individualModel.count()
                .then((totalIndividualCount:number)=> {
                    
                    const totalPageNumber = Math.ceil(totalIndividualCount / resultsPerPage);

                    resolve({
                        currentPage: pageNumber, 
                        totalPages: totalPageNumber,
                        individuals: mappedIndividuals
                    })
                })

            })
            .catch((error)=> reject(error))
        })
    })
}