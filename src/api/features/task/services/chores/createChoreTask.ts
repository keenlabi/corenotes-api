import { taskModel } from "../../model/task.model";
import { ITaskDocument } from "../../model/types";
import makeChoreTask, { IIMakeChoreTaskDets } from "./makeChoreTask";

export default function createChoreTask(chore:IIMakeChoreTaskDets) {
    return new Promise<ITaskDocument|null>((resolve, reject)=> {
        makeChoreTask(chore)
        .then(async (newTaskData) => {
            await taskModel.create(newTaskData)
            .then((createdTaskDocument)=> resolve(createdTaskDocument))
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    });
}