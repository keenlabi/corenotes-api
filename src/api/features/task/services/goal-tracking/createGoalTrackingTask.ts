import { taskModel } from "../../model/task.model";
import { ITaskDocument } from "../../model/types";
import makeGoalTrakingTask, { IIndividualGoalTrackingDets } from "./makeGoalTrakingTask";

export default function createGoalTrakingTask(goalTracking:IIndividualGoalTrackingDets) {
    return new Promise<ITaskDocument|null>((resolve, reject)=> {
        makeGoalTrakingTask(goalTracking)
        .then(async (newTaskData) => {
            await taskModel.create(newTaskData)
            .then((createdTaskDocument)=> resolve(createdTaskDocument))
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    });
}