import { Types } from "mongoose";
import getServiceByRefName from "src/api/features/services/services/db/getServiceByRefName";

export interface IIMakeSeizureTrackingTaskDets {
    individualId:string;
    seizureTracking:boolean;
    schedule: {
        startDate: string;
        frequency: string;
        frequencyAttr: number;
        time: string;
    };
}

export default function makeSeizureTrackingTask(seizureTrackingDets:IIMakeSeizureTrackingTaskDets) {
    return new Promise(async (resolve, reject)=> {
        const newTaskObjectId = new Types.ObjectId();

        const service = await getServiceByRefName("seizure-tracking");

        const splitDate = seizureTrackingDets.schedule.startDate.split('-'),
        year = parseInt(splitDate[0]), month= parseInt(splitDate[1]) - 1, date = parseInt(splitDate[2]),

        splitTime = seizureTrackingDets.schedule.time.split(':'),
        hour = parseInt(splitTime[0]), minutes = parseInt(splitTime[1]);

        const startDateTimeFormat = new Date(year, month, date, hour, minutes);
        const g = startDateTimeFormat.getTime() +  (2 * 60 * 60 * 1000);
        const endDateTimeFormat = new Date(g);
    
        resolve(Object.freeze({
            _id: newTaskObjectId,
            taskType: service?.refName,
            serviceId: service?._id.toString(),
            individualId: seizureTrackingDets.individualId,
            seizureTracking: seizureTrackingDets.seizureTracking,
            schedule:{
                startAt: startDateTimeFormat,
                endAt: endDateTimeFormat,
            },
        }))
    })
}