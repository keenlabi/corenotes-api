import { Types } from "mongoose";
import getServiceByRefName from "src/api/features/services/services/db/getServiceByRefName";

export interface IIMakeTornadoDrillTaskDets {
    individualId:string;
    tornadoDrill:boolean;
    schedule: {
        startDate: string;
        frequency: string;
        frequencyAttr: number;
        time: string;
    };
}

export default function makeTornadoDrillTask(tornadoDrillDets:IIMakeTornadoDrillTaskDets) {
    return new Promise(async (resolve, reject)=> {
        const newTaskObjectId = new Types.ObjectId();

        const service = await getServiceByRefName("tornado-drill");

        const splitDate = tornadoDrillDets.schedule.startDate.split('-'),
        year = parseInt(splitDate[0]), month= parseInt(splitDate[1]) - 1, date = parseInt(splitDate[2]),

        splitTime = tornadoDrillDets.schedule.time.split(':'),
        hour = parseInt(splitTime[0]), minutes = parseInt(splitTime[1]);

        const startDateTimeFormat = new Date(year, month, date, hour, minutes);
        const g = startDateTimeFormat.getTime() +  (2 * 60 * 60 * 1000);
        const endDateTimeFormat = new Date(g);
    
        resolve(Object.freeze({
            _id: newTaskObjectId,
            taskType: service?.refName,
            serviceId: service?._id.toString(),
            individualId: tornadoDrillDets.individualId,
            tornadoDrill: tornadoDrillDets.tornadoDrill,
            schedule:{
                startAt: startDateTimeFormat,
                endAt: endDateTimeFormat,
            },
        }))
    })
}