import { NotFoundError } from "@globals/server/Error";
import { taskModel } from "../model/task.model";
import { getIndividualByObjectId } from "@services/db/individual.service";
import { getServiceByObjectId } from "@services/db/service.service";
import { getMedicationByObjectId } from "@services/db/medication.service";
import getPRNMedicationHistoryByIndividualMedicationRef from "@individual/services/getPRNMedicationHistoryByIndividualMedicationRef";
import fetchIndividualMedicationPRNs, { IPRNMedication } from "@individual/services/fetchIndividualMedicationPRNs";

interface ITaskDetails {
    id:string;
    taskId:number;
    status:string;
    service:{
        title:string;
    };
    medication?:{
        id:string;
        name:string;
        strength:string;
        route:string;
        indications:Array<string>;
        amountLeft:number;
        category:string;
        barcode:number;
        PRN?:IPRNMedication[]
    };
    individual:{
        id:string;
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
                status: foundTask!.status,
                service: {
                    title: service?.title!
                },
                individual: {
                    id: individual?._id.toString() ?? "",
                    firstname: individual?.firstname ?? "",
                    lastname: individual?.lastname ?? "",
                    profileImage: individual?.profileImage ?? ""
                },
                schedule: {
                    startAt: foundTask!.schedule.startAt,
                    endAt: foundTask!.schedule.endAt
                }
            }

            if(foundTask?.medicationId) {
                await getMedicationByObjectId(foundTask.medicationId!)
                .then(async (foundMedication)=> {
                    
                    const individualMedInstance = individual?.medications.filter(medication => medication.medicationId === foundTask?.medicationId)[0];

                    taskResponse.medication = {
                        id: individualMedInstance?.medicationId!,
                        name: foundMedication?.name!,
                        strength: foundMedication?.strength!,
                        route: foundMedication?.route!,
                        indications: foundMedication?.indications!,
                        amountLeft: individualMedInstance?.amount.current ?? 0,
                        category: foundMedication?.category!,
                        barcode: foundMedication?.barcode!,
                    }

                    if(individualMedInstance?.prn?.length) {
                        await fetchIndividualMedicationPRNs(individualMedInstance?.medicationId)
                        .then((response)=> {
                            taskResponse.medication!.PRN = response
                        })
                    }
                })
            }

            resolve(taskResponse)
        })
        .catch((error)=> reject(error))
    })
}