import { taskModel } from "../../model/task.model";
import { ITaskDocument } from "../../model/types";
import makePRNMedReviewTask, { IIMakePRNMedReviewTaskDets } from "./makePRNMedReviewTask";

export default function createPRNMedReviewTask(prnMedReviewDets:IIMakePRNMedReviewTaskDets) {
    return new Promise<ITaskDocument|null>((resolve, reject)=> {
        makePRNMedReviewTask(prnMedReviewDets)
        .then(async (newTaskData) => {
            await taskModel.create(newTaskData)
            .then((createdTaskDocument)=> resolve(createdTaskDocument))
            .catch((error)=> reject(error))
        })
        .catch((error)=> reject(error))
    });
}