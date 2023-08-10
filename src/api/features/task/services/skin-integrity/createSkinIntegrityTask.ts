import { taskModel } from "../../model/task.model";
import { ITaskDocument } from "../../model/types";
import makeSkinIntegrityTask, { IIMakeSkinIntegrityTaskDets } from "./makeSkinIntegrityTask";

export default function createSkinIntegrityTask(skinIntegrityDets:IIMakeSkinIntegrityTaskDets) {
    return new Promise<ITaskDocument|null>((resolve, reject)=> {
        makeSkinIntegrityTask(skinIntegrityDets)
        .then(async (newTaskData) => {
            await taskModel.create(newTaskData)
            .then((createdTaskDocument)=> resolve(createdTaskDocument))
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    });
}