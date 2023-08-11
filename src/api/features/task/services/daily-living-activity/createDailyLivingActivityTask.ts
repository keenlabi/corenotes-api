import { taskModel } from "../../model/task.model";
import { ITaskDocument } from "../../model/types";
import makeDailyLivingActivityTask from "./makeDailyLivingActivityTask";
import { IIndividualDailyLivingActivityDets } from "./makeDailyLivingActivityTask";

export default function createDailyLivingActivityTask(dailyAcitivity:IIndividualDailyLivingActivityDets) {
    return new Promise<ITaskDocument|null>((resolve, reject)=> {
        makeDailyLivingActivityTask(dailyAcitivity)
        .then(async (newTaskData) => {
            await taskModel.create(newTaskData)
            .then((createdTaskDocument)=> resolve(createdTaskDocument))
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    });
}