import { taskModel } from "../model/task.model"
import { ITaskDocument } from "../model/types";

export default function declineTask(taskId:number) {
    return new Promise<ITaskDocument|null>((resolve, reject)=> {

        const query = { taskId };
        const updateObj = { $set: { status: "DECLINED"  } };

        taskModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedTask)=> resolve(updatedTask))
        .catch((error)=> reject(error))
    })
}