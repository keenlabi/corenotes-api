import { getServiceByObjectId } from "src/api/shared/services/db/service.service";
import { taskModel } from "../model/task.model"
import { getIndividualBehaviorById, getIndividualByObjectId, getIndividualChoreById } from "src/api/shared/services/db/individual.service";
import { getMedicationByObjectId } from "src/api/shared/services/db/medication.service";
import getIndividualGoalDetailsByPairObjectId from "@individual/services/getIndividualGoalDetailsByPairObjectId";
import getPRNMedicationHistoryByIndividualMedicationRef from "@individual/services/getPRNMedicationHistoryByIndividualMedicationRef";
import { medicationAdministrationHistoryModel } from "../../medication/model/medicationadministrationhistory.model";

export interface ITasksListResponse {
    currentPage:number;
    totalPages:number;
    tasks:Array<ITask>
}

interface ITask {
    id:string;
    taskId:number;
    status:string;
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

                if(task.prnMedicationHistoryId) {
                    await medicationAdministrationHistoryModel.findOne({ _id: task.prnMedicationHistoryId })
                    .then((foundPRNMedicationHistory)=> {
                        if(foundPRNMedicationHistory) {
                            getMedicationByObjectId(foundPRNMedicationHistory.medicationId)
                            .then((foundMedication)=> {
                                mappedTasks.push({
                                    id: task._id.toString(),
                                    taskId: task.taskId,
                                    status: task.status,
                                    desc: `${foundMedication?.name}`,
                                    service: {
                                        title: "PRN medication review"
                                    },
                                    individual: {
                                        firstname: individual?.firstname ?? "",
                                        lastname: individual?.lastname ?? "",
                                        profileImage: individual?.profileImage ?? ""
                                    },
                                    schedule: {
                                        startAt: task.schedule.startAt,
                                        endAt: task.schedule.endAt
                                    }
                                })
                            })
                            .catch((error)=> {

                            })
                        }
                    })
                }

                if(task.medicationId) {
                    await getMedicationByObjectId(task.medicationId!)
                    .then(async (foundMedication)=> {
                        mappedTasks.push({
                            id: task._id.toString(),
                            taskId: task.taskId,
                            status: task.status,
                            desc: `${foundMedication?.name!} ${foundMedication?.strength!}`,
                            service: {
                                title: (await getServiceByObjectId(task.serviceId))?.title!
                            },
                            individual: {
                                firstname: individual?.firstname ?? "",
                                lastname: individual?.lastname ?? "",
                                profileImage: individual?.profileImage ?? ""
                            },
                            schedule: {
                                startAt: task.schedule.startAt,
                                endAt: task.schedule.endAt
                            }
                        })
                    })
                }

                if(task.goalTrackingId) {
                    await getIndividualGoalDetailsByPairObjectId(individual?._id.toString() ?? "", task.goalTrackingId)
                    .then(async (foundGoalTrackingMatch)=> {
                        if(foundGoalTrackingMatch) {
                            mappedTasks.push({
                                id: task._id.toString(),
                                taskId: task.taskId,
                                status: task.status,
                                desc: foundGoalTrackingMatch?.method!,
                                service: {
                                    title: (await getServiceByObjectId(task.serviceId))?.title!
                                },
                                individual: {
                                    firstname: individual?.firstname ?? "",
                                    lastname: individual?.lastname ?? "",
                                    profileImage: individual?.profileImage ?? ""
                                },
                                schedule: {
                                    startAt: task.schedule.startAt,
                                    endAt: task.schedule.endAt
                                }
                            })
                        }
                    })
                    .catch((error)=> {
                        console.log(error)
                    })
                }

                if(task.skinIntegrity) {
                    mappedTasks.push({
                        id: task._id.toString(),
                        taskId: task.taskId,
                        status: task.status,
                        desc: "",
                        service: {
                            title: (await getServiceByObjectId(task.serviceId))?.title!
                        },
                        individual: {
                            firstname: individual?.firstname ?? "",
                            lastname: individual?.lastname ?? "",
                            profileImage: individual?.profileImage ?? ""
                        },
                        schedule: {
                            startAt: task.schedule.startAt,
                            endAt: task.schedule.endAt
                        }
                    })
                }

                if(task.bowelMovement) {
                    mappedTasks.push({
                        id: task._id.toString(),
                        taskId: task.taskId,
                        status: task.status,
                        desc: "",
                        service: {
                            title: (await getServiceByObjectId(task.serviceId))?.title!
                        },
                        individual: {
                            firstname: individual?.firstname ?? "",
                            lastname: individual?.lastname ?? "",
                            profileImage: individual?.profileImage ?? ""
                        },
                        schedule: {
                            startAt: task.schedule.startAt,
                            endAt: task.schedule.endAt
                        }
                    })
                }

                if(task.dailyLivingActivityId) {
                    // find individual daily living activity by id
                    const foundDailyLivingActivityDetails = individual?.dailyLivingActivities.filter(dailyLivingActivities => dailyLivingActivities._id.toString() === task.dailyLivingActivityId);
                    mappedTasks.push({
                        id: task._id.toString(),
                        taskId: task.taskId,
                        status: task.status,
                        desc: foundDailyLivingActivityDetails?.length ? foundDailyLivingActivityDetails[0].title : "",
                        service: {
                            title: (await getServiceByObjectId(task.serviceId))?.title!
                        },
                        individual: {
                            firstname: individual?.firstname ?? "",
                            lastname: individual?.lastname ?? "",
                            profileImage: individual?.profileImage ?? ""
                        },
                        schedule: {
                            startAt: task.schedule.startAt,
                            endAt: task.schedule.endAt
                        }
                    })
                }

                if(task.shiftNotes) {
                    mappedTasks.push({
                        id: task._id.toString(),
                        taskId: task.taskId,
                        status: task.status,
                        desc: "",
                        service: {
                            title: (await getServiceByObjectId(task.serviceId))?.title!
                        },
                        individual: {
                            firstname: individual?.firstname ?? "",
                            lastname: individual?.lastname ?? "",
                            profileImage: individual?.profileImage ?? ""
                        },
                        schedule: {
                            startAt: task.schedule.startAt,
                            endAt: task.schedule.endAt
                        }
                    })
                }

                if(task.bloodGlucoseCheck) {
                    mappedTasks.push({
                        id: task._id.toString(),
                        taskId: task.taskId,
                        status: task.status,
                        desc: "",
                        service: {
                            title: (await getServiceByObjectId(task.serviceId))?.title!
                        },
                        individual: {
                            firstname: individual?.firstname ?? "",
                            lastname: individual?.lastname ?? "",
                            profileImage: individual?.profileImage ?? ""
                        },
                        schedule: {
                            startAt: task.schedule.startAt,
                            endAt: task.schedule.endAt
                        }
                    })
                }

                if(task.behaviorManagementId) {
                    getIndividualBehaviorById(task.behaviorManagementId)
                    .then(async (foundIndividualBehavior)=> {
                        if(foundIndividualBehavior) {
                            mappedTasks.push({
                                id: task._id.toString(),
                                taskId: task.taskId,
                                status: task.status,
                                desc: foundIndividualBehavior.description,
                                service: {
                                    title: (await getServiceByObjectId(task.serviceId))?.title!
                                },
                                individual: {
                                    firstname: individual?.firstname ?? "",
                                    lastname: individual?.lastname ?? "",
                                    profileImage: individual?.profileImage ?? ""
                                },
                                schedule: {
                                    startAt: task.schedule.startAt,
                                    endAt: task.schedule.endAt
                                }
                            })
                        }
                    })
                }

                if(task.seizureTracking) {
                    mappedTasks.push({
                        id: task._id.toString(),
                        taskId: task.taskId,
                        status: task.status,
                        desc: "",
                        service: {
                            title: (await getServiceByObjectId(task.serviceId))?.title!
                        },
                        individual: {
                            firstname: individual?.firstname ?? "",
                            lastname: individual?.lastname ?? "",
                            profileImage: individual?.profileImage ?? ""
                        },
                        schedule: {
                            startAt: task.schedule.startAt,
                            endAt: task.schedule.endAt
                        }
                    })
                }

                if(task.fireDrill) {
                    mappedTasks.push({
                        id: task._id.toString(),
                        taskId: task.taskId,
                        status: task.status,
                        desc: "",
                        service: {
                            title: (await getServiceByObjectId(task.serviceId))?.title!
                        },
                        individual: {
                            firstname: individual?.firstname ?? "",
                            lastname: individual?.lastname ?? "",
                            profileImage: individual?.profileImage ?? ""
                        },
                        schedule: {
                            startAt: task.schedule.startAt,
                            endAt: task.schedule.endAt
                        }
                    })
                }

                if(task.tornadoDrill) {
                    mappedTasks.push({
                        id: task._id.toString(),
                        taskId: task.taskId,
                        status: task.status,
                        desc: "",
                        service: {
                            title: (await getServiceByObjectId(task.serviceId))?.title!
                        },
                        individual: {
                            firstname: individual?.firstname ?? "",
                            lastname: individual?.lastname ?? "",
                            profileImage: individual?.profileImage ?? ""
                        },
                        schedule: {
                            startAt: task.schedule.startAt,
                            endAt: task.schedule.endAt
                        }
                    })
                }

                if(task.choreId) {
                    getIndividualChoreById(task.choreId)
                    .then(async (foundIndividualChore)=> {
                        if(foundIndividualChore) {
                            mappedTasks.push({
                                id: task._id.toString(),
                                taskId: task.taskId,
                                status: task.status,
                                desc: foundIndividualChore.description,
                                service: {
                                    title: (await getServiceByObjectId(task.serviceId))?.title!
                                },
                                individual: {
                                    firstname: individual?.firstname ?? "",
                                    lastname: individual?.lastname ?? "",
                                    profileImage: individual?.profileImage ?? ""
                                },
                                schedule: {
                                    startAt: task.schedule.startAt,
                                    endAt: task.schedule.endAt
                                }
                            })
                        }
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