import { taskModel } from "../../model/task.model";
import { ITaskDocument } from "../../model/types";
import makeShiftNotesTask, { IIMakeShiftNotesTaskDets } from "./makeShiftNotesTask";

export default function createShiftNotesTask(shiftNotesDets:IIMakeShiftNotesTaskDets) {
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