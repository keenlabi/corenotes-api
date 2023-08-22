import { NotFoundError } from "@globals/server/Error";
import { taskModel } from "../model/task.model";
import { getIndividualByObjectId } from "@services/db/individual.service";
import { getServiceByObjectId } from "@services/db/service.service";
import { getMedicationByObjectId } from "@services/db/medication.service";
import fetchIndividualMedicationPRNs, { IPRNMedication } from "@individual/services/fetchIndividualMedicationPRNs";
import getIndividualGoalDetailsByPairObjectId from "@individual/services/getIndividualGoalDetailsByPairObjectId";
import { individualBehaviorServiceModel } from "@individual/models/individual-behavior-service.model";
import { individualChoreServiceModel } from "@individual/models/individual-chore-service.model";
import { medicationAdministrationHistoryModel } from "../../medication/model/medicationadministrationhistory.model";

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
    prnMedicationReview?:IPRNMedication;
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
    },
    behaviorManagement?:{
        id:string;
        description:string;
        goals:string[];
    },
    chore?:{
        id:string;
        title:string;
        description:string;
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
                individual: {
                    id: individual?._id.toString() ?? "",
                    firstname: individual?.firstname ?? "",
                    lastname: individual?.lastname ?? "",
                    profileImage: individual?.profileImage ?? ""
                },
                schedule: {
                    startAt: foundTask!.schedule.startAt,
                    endAt: foundTask!.schedule.endAt
                },
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

            if(foundTask!.prnMedicationHistoryId) {
                await medicationAdministrationHistoryModel.findOne({ _id: foundTask!.prnMedicationHistoryId })
                .then(async (foundPRNMedicationHistory)=> {
                    if(foundPRNMedicationHistory) {
                        await getMedicationByObjectId(foundPRNMedicationHistory.medicationId)
                        .then((foundMedication)=> {
                            if(foundMedication) {
                                taskResponse.service = {
                                    title: "PRN medication review"
                                };

                                taskResponse.prnMedicationReview = {
                                    id: foundPRNMedicationHistory._id.toString(),
                                    title: foundPRNMedicationHistory.title,
                                    note: foundPRNMedicationHistory.note,
                                    name: foundMedication!.name,
                                    amountAdministered: foundPRNMedicationHistory.amountAdministered,
                                    createdAt: foundPRNMedicationHistory.createdAt!
                                }
                            }
                        })
                        .catch((error)=> {
                            console.log("There was an error getting PRN medication history details");
                            console.log(error);
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

            if(foundTask?.behaviorManagementId) {
                // find individual daily living activity by id
                const query = { _id: foundTask.behaviorManagementId }
                
                await individualBehaviorServiceModel.findOne(query)
                .then((foundIndividualBehavior)=> {
                    if(foundIndividualBehavior) {
                        taskResponse.behaviorManagement = {
                            id: foundIndividualBehavior._id.toString(),
                            description: foundIndividualBehavior.description,
                            goals: foundIndividualBehavior.goals
                        }
                    }
                })
                .catch((error)=> {
                    console.log("There was an error fetching behavior management details in fetch tasks", error)
                });
            }

            if(foundTask?.choreId) {
                // find individual daily living activity by id
                const query = { _id: foundTask.choreId }
                
                await individualChoreServiceModel.findOne(query)
                .then((foundIndividualChore)=> {
                    if(foundIndividualChore) {
                        taskResponse.chore = {
                            id: foundIndividualChore._id.toString(),
                            title: foundIndividualChore.title,
                            description: foundIndividualChore.description
                        }
                    }
                })
                .catch((error)=> {
                    console.log("There was an error fetching behavior management details in fetch tasks", error)
                });
            }

            resolve(taskResponse)
        })
        .catch((error)=> reject(error))
    })
}