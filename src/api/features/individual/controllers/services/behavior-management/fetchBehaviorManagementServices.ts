import { getIndividualByIndividualId } from "src/api/shared/services/db/individual.service"
import { NotFoundError } from "@globals/server/Error";
import { individualBehaviorServiceModel } from "@individual/models/individual-behavior-service.model";
import detMedSchedule from "@individual/services/detMedSchedule";

interface IFetchIndividualBehaviorResponse {
    currentPage:number;
    totalPages:number;
    behaviorManagementServices:Array<IIndividualBehavior>
}

interface IIndividualBehavior {
    id:string;
    description:string;
    goals:Array<string>;
    frequency:string;
    time:Array<string>;
    createdAt:Date;
}

export default function fetchBehaviorManagementServices(individualId:number, pageNumber:number) {
    return new Promise<IFetchIndividualBehaviorResponse>((resolve, reject)=> {
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

            individualBehaviorServiceModel.find(query)
            .skip(pageOffset)
            .limit(resultsPerPage)
            .sort({ createdAt: -1 })
            .then(async (foundIndividualBehaviors)=> {
                console.log(foundIndividualBehaviors)
                
                const mappedIndividualBehaviors:Array<IIndividualBehavior> = [];

                for await ( const individualBehavior of foundIndividualBehaviors ) {
                    mappedIndividualBehaviors.unshift({
                        id: individualBehavior._id.toString(),
                        description: individualBehavior.description,
                        goals: individualBehavior.goals,
                        frequency: detMedSchedule(individualBehavior.schedule?.frequency, individualBehavior.schedule?.startDate, individualBehavior.schedule?.frequencyAttr),
                        time: individualBehavior.schedule?.time,
                        createdAt: individualBehavior.createdAt
                    })
                }

                individualBehaviorServiceModel.count(query)
                .then((totalIndividualBehaviorCount)=> {
                    resolve({
                        currentPage: pageNumber,
                        totalPages: totalIndividualBehaviorCount ?? pageNumber,
                        behaviorManagementServices: mappedIndividualBehaviors
                    })
                })
                .catch(()=> {
                    resolve({
                        currentPage: pageNumber,
                        totalPages: pageNumber,
                        behaviorManagementServices: mappedIndividualBehaviors
                    })
                })
            })
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    })
}