import { getIndividualByIndividualId } from "@services/db/individual.service"
import { NotFoundError } from "@globals/server/Error";
import detMedSchedule from "@individual/services/detMedSchedule";
import { individualChoreServiceModel } from "@individual/models/individual-chore-service.model";

interface IFetchIndividualChoreResponse {
    currentPage:number;
    totalPages:number;
    choreServices:Array<IIndividualChore>
}

interface IIndividualChore {
    id:string;
    title:string;
    description:string;
    frequency:string;
    time:Array<string>;
    createdAt:Date;
}

export default function fetchChoreServices(individualId:number, pageNumber:number) {
    return new Promise<IFetchIndividualChoreResponse>((resolve, reject)=> {
        getIndividualByIndividualId(individualId)
        .then(async (foundIndividual)=> {

            if(!foundIndividual) {
                const notFoundError = new NotFoundError('Individual not found')
                reject(notFoundError)
            }
            
            const queryPageNumber = pageNumber - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * queryPageNumber;

            const query = { individualId: foundIndividual?._id.toString() };

            individualChoreServiceModel.find(query)
            .skip(pageOffset)
            .limit(resultsPerPage)
            .sort({ createdAt: -1 })
            .then(async (foundIndividualChores)=> {
                
                const mappedIndividualChores:Array<IIndividualChore> = [];

                for await ( const individualChore of foundIndividualChores ) {
                    mappedIndividualChores.unshift({
                        id: individualChore._id.toString(),
                        description: individualChore.description,
                        title: individualChore.title,
                        frequency: detMedSchedule(individualChore.schedule?.frequency, individualChore.schedule?.startDate, individualChore.schedule?.frequencyAttr),
                        time: individualChore.schedule?.time,
                        createdAt: individualChore.createdAt
                    })
                }

                individualChoreServiceModel.count(query)
                .then((totalIndividualChoreCount)=> {
                    resolve({
                        currentPage: pageNumber,
                        totalPages: totalIndividualChoreCount ?? pageNumber,
                        choreServices: mappedIndividualChores
                    })
                })
                .catch(()=> {
                    resolve({
                        currentPage: pageNumber,
                        totalPages: pageNumber,
                        choreServices: mappedIndividualChores
                    })
                })
            })
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    })
}