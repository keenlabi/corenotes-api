import { taskModel } from "../../model/task.model";
import { ITaskDocument } from "../../model/types";
import makeBehaviorManagementTask, { IIMakeBehaviorManagementTaskDets } from "./makeBehaviorManagementTask";

export default function createBehaviorManagementTask(behavior:IIMakeBehaviorManagementTaskDets) {
    return new Promise<ITaskDocument|null>((resolve, reject)=> {
        makeBehaviorManagementTask(behavior)
        .then(async (newTaskData) => {
            await taskModel.create(newTaskData)
            .then((createdTaskDocument)=> resolve(createdTaskDocument))
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    });
}