import { Types } from "mongoose";
import getServiceByRefName from "src/api/features/services/services/db/getServiceByRefName";
import getServiceByServiceId from "src/api/features/services/services/db/getServiceByServiceId";

export interface IIndividualGoalTrackingDets {
    individualId:string;
    goalTrackingId:string;
    schedule: {
        startDate: string;
        frequency: string;
        frequencyAttr: number;
        time: string;
    };
}

export interface IIndividualGoalTrakingTask {
    _id: Types.ObjectId;
    medicationId:string;
    goalTrackingId:string;
    schedule: {
        startDate: string;
        frequency: string;
        frequencyAttr: number;
        time: string;
    };
}

export default function makeGoalTrakingTask(goalTracking:IIndividualGoalTrackingDets) {
    return new Promise(async (resolve, reject)=> {
        const newTaskObjectId = new Types.ObjectId();

        const service = await getServiceByRefName("goal-tracking");

        const splitDate = goalTracking.schedule.startDate.split('-'),
        year = parseInt(splitDate[0]), month= parseInt(splitDate[1]) - 1, date = parseInt(splitDate[2]),

        splitTime = goalTracking.schedule.time.split(':'),
        hour = parseInt(splitTime[0]), minutes = parseInt(splitTime[1]);

        const startDateTimeFormat = new Date(year, month, date, hour, minutes);
        const g = startDateTimeFormat.getTime() +  (2 * 60 * 60 * 1000);
        const endDateTimeFormat = new Date(g);
    
        resolve(Object.freeze({
            _id: newTaskObjectId,
            taskType: service?.title.replace(/\s/g, '-'),
            serviceId: service?._id.toString(),
            individualId: goalTracking.individualId,
            goalTrackingId: goalTracking.goalTrackingId,
            schedule:{
                startAt: startDateTimeFormat,
                endAt: endDateTimeFormat,
            },
        }))
    })
}