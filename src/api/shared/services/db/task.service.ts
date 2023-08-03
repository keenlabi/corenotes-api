import { NotFoundError } from "@globals/server/Error";
import { taskModel } from "src/api/features/task/model/task.model";
import { ITaskDocument } from "src/api/features/task/model/types";

export function getTaskByObjectId(taskId:string) {
    return new Promise<ITaskDocument>((resolve, reject)=> {
        const query = { _id: taskId };

        taskModel.findOne(query)
        .then((foundTask)=> {
            if(!foundTask) {
                const notFoundError = new NotFoundError("Task not found");
                reject(notFoundError);
            }

            resolve(foundTask!)
        })
        .catch((error)=> reject(error))
    })
}

export function getTaskByTaskId(taskId:number) {
    return new Promise<ITaskDocument>((resolve, reject)=> {
        const query = { taskId };

        taskModel.findOne(query)
        .then((foundTask)=> {
            if(!foundTask) {
                const notFoundError = new NotFoundError("Task not found");
                reject(notFoundError);
            }

            resolve(foundTask!)
        })
        .catch((error)=> reject(error))
    })
}

export function getTaskByMedicationId(medicationId:string, individualId:string, startDate:string, time:string) {
    return new Promise<ITaskDocument|null>((resolve, reject)=> {

        const splitDate = startDate.split('-'),
        year = parseInt(splitDate[0]), month= parseInt(splitDate[1]), date = parseInt(splitDate[2]),

        splitTime = time.split(':'),
        hour = parseInt(splitTime[0]), minutes = parseInt(splitTime[1]);

        const startDateTimeFormat = new Date(year, month, date, hour, minutes);
        const g = startDateTimeFormat.getTime() +  (2 * 60 * 60 * 1000);
        const endDateTimeFormat = new Date(g);

        const query = { 
            medicationId, 
            individualId, 
            schedule: {
                startAt: startDateTimeFormat,
                endAt: endDateTimeFormat
            }
        }

        console.log(query)

        taskModel.findOne(query)
        .then((foundTask)=> {
            console.log(foundTask)
            resolve(foundTask)
        })
        .catch((error)=> {
            console.log(error)
            reject(error)
        })
    })
}