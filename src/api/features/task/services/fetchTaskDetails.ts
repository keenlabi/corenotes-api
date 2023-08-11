import { NotFoundError } from "@globals/server/Error";
import { taskModel } from "../model/task.model";
import { getIndividualByObjectId } from "@services/db/individual.service";
import { getServiceByObjectId } from "@services/db/service.service";
import { getMedicationByObjectId } from "@services/db/medication.service";
import getPRNMedicationHistoryByIndividualMedicationRef from "@individual/services/getPRNMedicationHistoryByIndividualMedicationRef";
import fetchIndividualMedicationPRNs, { IPRNMedication } from "@individual/services/fetchIndividualMedicationPRNs";
import getIndividualGoalDetailsByPairObjectId from "@individual/services/getIndividualGoalDetailsByPairObjectId";

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
    goalTracking?: {
        id:string;
        objective:string;
        method:string;
    },
    individual:{
        id:string;
        firstname:string;
        lastname:string;
        profileImage:string;
    },
    schedule:{
        startAt:Date;
        endAt:Date;
    },
    dailyLivingActivity?:{
        id:string;
        title:string;
        instructions:string;
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
                service: { title: service?.title! },
                individual:{
                    id: individual?._id.toString() ?? "",
                    firstname: individual?.firstname ?? "",
                    lastname: individual?.lastname ?? "",
                    profileImage: individual?.profileImage ?? ""
                },
                schedule:{
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

            if(foundTask?.goalTrackingId) {
                await getIndividualGoalDetailsByPairObjectId(individual?._id.toString() ?? "", foundTask.goalTrackingId)
                .then(async (foundGoalTrackingMatch)=> {
                    if(foundGoalTrackingMatch) {
                        taskResponse.goalTracking = {
                            id: foundGoalTrackingMatch._id.toString(),
                            objective: foundGoalTrackingMatch.objective,
                            method: foundGoalTrackingMatch.method
                        }
                    }
                })
                .catch((error)=> {
                    console.log(error)
                })
            }

            if(foundTask?.dailyLivingActivityId) {
                // find individual daily living activity by id
                const foundDailyLivingActivityDetails = individual?.dailyLivingActivities.filter(dailyLivingActivities => dailyLivingActivities._id.toString() === foundTask.dailyLivingActivityId);
                taskResponse.dailyLivingActivity = {
                    id: foundDailyLivingActivityDetails![0]._id.toString(),
                    title: foundDailyLivingActivityDetails![0].title,
                    instructions: foundDailyLivingActivityDetails![0].instructions
                }
            }

            resolve(taskResponse)
        })
        .catch((error)=> reject(error))
    })
}