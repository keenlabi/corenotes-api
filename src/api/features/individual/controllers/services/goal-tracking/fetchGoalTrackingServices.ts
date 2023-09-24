import { getIndividualByIndividualId } from "src/api/shared/services/db/individual.service"
import { getMedicationByObjectId } from "src/api/shared/services/db/medication.service";
import { NotFoundError } from "@globals/server/Error";
import detMedSchedule from "@individual/services/detMedSchedule";

interface IFetchIndividualGoalsResponse {
    currentPage:number;
    totalPages:number;
    goals:Array<IIndividualGoal>
}

interface IIndividualGoal {
    id:string;
    objective:string;
    method:string;
    frequency:string;
    time:string;
}

export default function fetchGoalTrackingServices(individualId:number, pageNumber:number) {
    return new Promise<IFetchIndividualGoalsResponse>((resolve, reject)=> {
        getIndividualByIndividualId(individualId)
        .then(async (foundIndividual)=> {

            if(!foundIndividual) {
                const notFoundError = new NotFoundError('Individual not found')
                reject(notFoundError)
            }
            
            const queryPageNumber = pageNumber - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * queryPageNumber,
            pageEndIndex = pageOffset + resultsPerPage;

            const goals = foundIndividual!.goalTracking?.slice(pageOffset, pageEndIndex).reverse()!;
            
            const mappedGoals:Array<IIndividualGoal> = [];

            if(goals?.length) {
                for await ( const goal of goals ) {
                    mappedGoals.push({
                        id: goal._id.toString(),
                        objective: goal.objective,
                        method: goal.method,
                        frequency: detMedSchedule(goal.schedule.frequency, goal.schedule.startDate, goal.schedule.frequencyAttr),
                        time: goal?.schedule.time
                    })   
                }
            }

            resolve({
                currentPage: pageNumber,
                totalPages: Math.ceil(foundIndividual!.goalTracking!.length / resultsPerPage) || pageNumber,
                goals: mappedGoals
            })

        })
        .catch((error)=> reject(error))
    })
}