import { taskModel } from "../../model/task.model";
import { ITaskDocument } from "../../model/types";
import makeFireDrillTask, { IIMakeFireDrillTaskDets } from "./makeFireDrillTask";

export default function createFireDrillTask(shiftNotesDets:IIMakeFireDrillTaskDets) {
    return new Promise<ITaskDocument|null>((resolve, reject)=> {
        makeFireDrillTask(shiftNotesDets)
        .then(async (newTaskData) => {
            await taskModel.create(newTaskData)
            .then((createdTaskDocument)=> resolve(createdTaskDocument))
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    });
}