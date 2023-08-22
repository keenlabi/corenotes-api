import { taskModel } from "../../model/task.model";
import { ITaskDocument } from "../../model/types";
import makeTornadoDrillTask, { IIMakeTornadoDrillTaskDets } from "./makeTornadoDrillTask";

export default function createTornadoDrillTask(shiftNotesDets:IIMakeTornadoDrillTaskDets) {
    return new Promise<ITaskDocument|null>((resolve, reject)=> {
        makeTornadoDrillTask(shiftNotesDets)
        .then(async (newTaskData) => {
            await taskModel.create(newTaskData)
            .then((createdTaskDocument)=> resolve(createdTaskDocument))
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    });
}