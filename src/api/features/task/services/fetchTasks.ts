import { getServiceByObjectId } from "@services/db/service.service";
import { taskModel } from "../model/task.model"
import { getIndividualByObjectId } from "@services/db/individual.service";
import { getMedicationByObjectId } from "@services/db/medication.service";

interface ITasksListResponse {
    currentPage:number;
    totalPages:number;
    tasks:Array<ITask>
}

interface ITask {
    id:string;
    taskId:number;
    desc:string;
    service:{
        title:string;
    };
    individual:{
        firstname:string;
        lastname:string;
        profileImage:string;
    },
    schedule:{
        startAt:Date;
        endAt:Date;
    }
}

export default function fetchTasks(pageNumber:number) {
    return new Promise<ITasksListResponse>((resolve, reject)=> {

        const queryPageNumber = pageNumber - 1 ?? 0,
        resultsPerPage = 10, 
        pageOffset = resultsPerPage * queryPageNumber;

        const query = { }

        taskModel.find(query)
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then(async (foundTasks)=> {

            const mappedTasks:Array<ITask> = []

            for await ( const task of foundTasks ) {
                
                const individual = (await getIndividualByObjectId(task.individualId))

                if(task.medicationId) {
                    await getMedicationByObjectId(task.medicationId!)
                    .then(async (foundMedication)=> {
                        mappedTasks.push({
                            id: task._id.toString(),
                            taskId: task.taskId,
                            desc: `${foundMedication?.name!} ${foundMedication?.strength!}`,
                            service: {
                                title: (await getServiceByObjectId(task.serviceId))?.title!
                            },
                            individual: {
                                firstname: individual.firstname,
                                lastname: individual.lastname,
                                profileImage: individual.profileImage
                            },
                            schedule: {
                                startAt: task.schedule.startAt,
                                endAt: task.schedule.endAt
                            }
                        })
                    })
                }
            }


            taskModel.count()
            .then((totalTasksCount:number)=> {
                const totalPageNumber = Math.ceil(totalTasksCount / resultsPerPage);

                resolve({
                    currentPage: pageNumber,
                    totalPages: totalPageNumber,
                    tasks: mappedTasks
                })
            })
        })
        .catch((error)=> reject(error))
    })
}