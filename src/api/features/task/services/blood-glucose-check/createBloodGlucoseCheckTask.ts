import { taskModel } from "../../model/task.model";
import { ITaskDocument } from "../../model/types";
import makeBloodGlucoseCheckTask, { IIMakeBloodGlucoseCheckTaskDets } from "./makeBloodGlucoseCheckTask";

export default function createBloodGlucoseCheckTask(bloodGlucoseCheck:IIMakeBloodGlucoseCheckTaskDets) {
    return new Promise<ITaskDocument|null>((resolve, reject)=> {
        makeBloodGlucoseCheckTask(bloodGlucoseCheck)
        .then(async (newTaskData) => {
            await taskModel.create(newTaskData)
            .then((createdTaskDocument)=> resolve(createdTaskDocument))
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    });
}