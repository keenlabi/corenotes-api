import { Types } from "mongoose";
import getServiceByRefName from "src/api/features/services/services/db/getServiceByRefName";

export interface IIndividualDailyLivingActivityDets {
    individualId:string;
    dailyLivingActivityId:string;
    schedule: {
        startDate: string;
        frequency: string;
        frequencyAttr: number;
        time: string;
    };
}

export interface IIndividualDailyLivingActivityTask {
    _id: Types.ObjectId;
    taskType:string;
    serviceId:string;
    individualId:string;
    dailyLivingActivityId:string;
    schedule:{
        startAt:Date;
        endAt:Date;
    };
}

export default function makeGoalTrakingTask(dailyLivingActivity:IIndividualDailyLivingActivityDets) {
    return new Promise<IIndividualDailyLivingActivityTask>(async (resolve, reject)=> {
        const newTaskObjectId = new Types.ObjectId();

        const service = await getServiceByRefName("daily-living-activity");

        const splitDate = dailyLivingActivity.schedule.startDate.split('-'),
        year = parseInt(splitDate[0]), month= parseInt(splitDate[1]) - 1, date = parseInt(splitDate[2]),

        splitTime = dailyLivingActivity.schedule.time.split(':'),
        hour = parseInt(splitTime[0]), minutes = parseInt(splitTime[1]);

        const startDateTimeFormat = new Date(year, month, date, hour, minutes);
        const g = startDateTimeFormat.getTime() +  (2 * 60 * 60 * 1000);
        const endDateTimeFormat = new Date(g);
    
        resolve(Object.freeze({
            _id: newTaskObjectId,
            taskType: service!.title.replace(/\s/g, '-'),
            serviceId: service!._id.toString(),
            individualId: dailyLivingActivity.individualId,
            dailyLivingActivityId: dailyLivingActivity.dailyLivingActivityId,
            schedule:{
                startAt: startDateTimeFormat,
                endAt: endDateTimeFormat,
            },
        }))
    })
}