import { taskModel } from "../../model/task.model";
import { ITaskDocument } from "../../model/types";
import makeBowelMovementTask, { IIMakeBowelMovementTaskDets } from "./makeBowelMovementTask";

export default function createBowelMovementTask(skinIntegrityDets:IIMakeBowelMovementTaskDets) {
    return new Promise<ITaskDocument|null>((resolve, reject)=> {
        makeBowelMovementTask(skinIntegrityDets)
        .then(async (newTaskData) => {
            await taskModel.create(newTaskData)
            .then((createdTaskDocument)=> resolve(createdTaskDocument))
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    });
}