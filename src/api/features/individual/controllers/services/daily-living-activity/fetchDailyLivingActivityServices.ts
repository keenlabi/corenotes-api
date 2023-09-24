import { getIndividualByIndividualId } from "src/api/shared/services/db/individual.service"
import { NotFoundError } from "@globals/server/Error";
import detMedSchedule from "@individual/services/detMedSchedule";
import paginateList from "@globals/helpers/paginateList";
import { IIndividualDailyLivingActivitySubDocument } from "@individual/models/types";

interface IFetchIndividualDailyLivingActivityResponse {
    currentPage:number;
    totalPages:number;
    dailyLivingActivities:Array<IIndividualDailyLivingActivity>
}

interface IIndividualDailyLivingActivity {
    id:string;
    title:string;
    instructions:string;
    frequency:string;
    time:string;
}

export default function fetchDailyLivingActivityServices(individualId:number, pageNumber:number) {
    return new Promise<IFetchIndividualDailyLivingActivityResponse>((resolve, reject)=> {
        getIndividualByIndividualId(individualId)
        .then(async (foundIndividual)=> {

            if(!foundIndividual) {
                const notFoundError = new NotFoundError('Individual not found')
                reject(notFoundError)
            }

            const dailyLivingActivities = paginateList(foundIndividual!.dailyLivingActivities.reverse(), pageNumber, 10)

            const mappedDailyLivingActivities:Array<IIndividualDailyLivingActivity> = [];

            if(dailyLivingActivities.currentPageList.length) {
                for await ( const dailyLivingActivity of dailyLivingActivities.currentPageList ) {
                    mappedDailyLivingActivities.push({
                        id: dailyLivingActivity._id.toString(),
                        title: dailyLivingActivity.title,
                        instructions: dailyLivingActivity.instructions,
                        frequency: detMedSchedule(dailyLivingActivity.schedule.frequency, dailyLivingActivity.schedule.startDate, dailyLivingActivity.schedule.frequencyAttr),
                        time: dailyLivingActivity?.schedule.time
                    })   
                }
            }

            resolve({
                currentPage: dailyLivingActivities.currentPageNumber,
                totalPages: dailyLivingActivities.totalPageNumber,
                dailyLivingActivities: mappedDailyLivingActivities
            })

        })
        .catch((error)=> reject(error))
    })
}