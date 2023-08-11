import { Types } from "mongoose";
import getServiceByRefName from "src/api/features/services/services/db/getServiceByRefName";
import getServiceByServiceId from "src/api/features/services/services/db/getServiceByServiceId";

export interface IIMakeSkinIntegrityTaskDets {
    individualId:string;
    skinIntegrity:boolean;
    schedule: {
        startDate: string;
        frequency: string;
        frequencyAttr: number;
        time: string;
    };
}

export default function makeSkinIntegrityTask(skinIntegrityDets:IIMakeSkinIntegrityTaskDets) {
    return new Promise(async (resolve, reject)=> {
        const newTaskObjectId = new Types.ObjectId();

        const service = await getServiceByRefName("skin-integrity");

        const splitDate = skinIntegrityDets.schedule.startDate.split('-'),
        year = parseInt(splitDate[0]), month= parseInt(splitDate[1]) - 1, date = parseInt(splitDate[2]),

        splitTime = skinIntegrityDets.schedule.time.split(':'),
        hour = parseInt(splitTime[0]), minutes = parseInt(splitTime[1]);

        const startDateTimeFormat = new Date(year, month, date, hour, minutes);
        const g = startDateTimeFormat.getTime() +  (2 * 60 * 60 * 1000);
        const endDateTimeFormat = new Date(g);
    
        resolve(Object.freeze({
            _id: newTaskObjectId,
            taskType: service?.title.replace(/\s/g, '-'),
            serviceId: service?._id.toString(),
            individualId: skinIntegrityDets.individualId,
            skinIntegrity: skinIntegrityDets.skinIntegrity,
            schedule:{
                startAt: startDateTimeFormat,
                endAt: endDateTimeFormat,
            },
        }))
    })
}