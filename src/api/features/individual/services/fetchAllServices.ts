import { NotFoundError } from "@globals/server/Error";
import individualModel from "@individual/models/individual.model";
import { getCompartmentById } from "@services/db/compartment.service";

export interface IFetchIndividualResponse {
    currentPage:number;
    totalPages:number,
    individuals:IIndividualListItem[]
}

export interface IIndividualListItem {
    id:string;
    profileImage:string;
    firstname:string;
    lastname:string;
    dob:string;
    gender:string;
    compartment:string;
    medicaidNumber:number;
}

export default function fetchAllIndividuals(pageNumber:number) {
    return new Promise<IFetchIndividualResponse>((resolve, reject)=> {
        const   queryPageNumber = pageNumber - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * queryPageNumber;

        const query = { active: true }

        individualModel.find(query)
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then(async (foundIndividuals)=> {
        
            if(!foundIndividuals.length) {
                const notFoundError = new NotFoundError('No individuals found');
                reject(notFoundError)
            }

            const mappedIndividuals:IIndividualListItem[] = [];

            for await ( const individual of foundIndividuals ) {
                mappedIndividuals.push({
                    id:individual._id,
                    profileImage: individual.profileImage,
                    firstname: individual.firstname,
                    lastname: individual.lastname,
                    dob: individual.dob,
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
        .catch((error)=> {
            console.log(`USER FETCH ERROR: There was an error retrieving individuals. `, error)
            reject(error)
        })
    })
}