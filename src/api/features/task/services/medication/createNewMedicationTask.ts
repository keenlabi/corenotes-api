import { taskModel } from "../../model/task.model";
import { ITaskDocument } from "../../model/types";
import makeMedicationTask, { IIndividualMedication } from "./makeMedicationTask";

export default function createNewMedicationTask(medication:IIndividualMedication) {
    return new Promise<ITaskDocument|null>((resolve, reject)=> {
        makeMedicationTask(medication)
        .then(async (newTaskData) => {
            await taskModel.create(newTaskData)
            .then((createdTaskDocument)=> resolve(createdTaskDocument))
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    });
}