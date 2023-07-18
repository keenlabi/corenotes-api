import { NotFoundError } from "@globals/server/Error";
import { taskModel } from "../model/task.model";
import { getIndividualByObjectId } from "@services/db/individual.service";
import { getServiceByObjectId } from "@services/db/service.service";
import getIndividualMedications from "@individual/controllers/medications/getIndividualMedications";
import { getMedicationByObjectId } from "@services/db/medication.service";

interface ITaskDetails {
    id:string;
    taskId:number;
    service:{
        title:string;
    };
    medication?:{
        name:string;
        strength:string;
        route:string;
        indications:Array<string>;
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

export default function fetchTaskDetails(taskId:number) {
    return new Promise<ITaskDetails>((resolve, reject)=> {

        const query = { taskId }

        taskModel.findOne(query)
        .then(async (foundTask)=> {
            if(!foundTask) {
                const notFoundError = new NotFoundError('Task not found');
                reject(notFoundError)
            }

            const service = await getServiceByObjectId(foundTask!.serviceId)
            const individual = await getIndividualByObjectId(foundTask!.individualId)

            const taskResponse:ITaskDetails = {
                id: foundTask!._id.toString(),
                taskId: foundTask!.taskId,
                service: {
                    title: service?.title!
                },
                individual: {
                    firstname: individual.firstname,
                    lastname: individual.lastname,
                    profileImage: individual.profileImage
                },
                schedule: {
                    startAt: foundTask!.schedule.startAt,
                    endAt: foundTask!.schedule.endAt
                }
            }

            if(foundTask?.medicationId) {
                await getMedicationByObjectId(foundTask.medicationId!)
                .then((foundMedication)=> {
                    taskResponse.medication = {
                        name: foundMedication?.name!,
                        strength: foundMedication?.strength!,
                        route: foundMedication?.route!,
                        indications: foundMedication?.indications!,
                    }
                })
            }

            resolve(taskResponse)
        })
        .catch((error)=> reject(error))
    })
}