import { taskModel } from "../../model/task.model";
import { ITaskDocument } from "../../model/types";
import makeShiftNotesTask, { IIMakeSeizureTrackingTaskDets } from "./makeSeizureTrackingTask";

export default function createSeizureTrackingTask(shiftNotesDets:IIMakeSeizureTrackingTaskDets) {
    return new Promise<ITaskDocument|null>((resolve, reject)=> {
        makeShiftNotesTask(shiftNotesDets)
        .then(async (newTaskData) => {
            await taskModel.create(newTaskData)
            .then((createdTaskDocument)=> resolve(createdTaskDocument))
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    });
}