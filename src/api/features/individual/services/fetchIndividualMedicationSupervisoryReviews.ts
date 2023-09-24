import paginateList from "@globals/helpers/paginateList";
import { NotFoundError } from "@globals/server/Error";
import { getIndividualByIndividualId } from "src/api/shared/services/db/individual.service"
import { getStaffUserById } from "src/api/shared/services/db/staff.service";

interface IFetchIndividualMedicationSupervisoryReviewResponse {
    medicationId:string;
    supervisoryReviews:IMedicationSupervisoryReviewListItem[];
    lastMonthReviewed?:number;
    currentPage:number;
    totalPages:number;
}

export interface IMedicationSupervisoryReviewListItem {
    id:string;
    month:string;
    signedBy:{
        firstname:string;
        lastname:string;
        role:string;
        profilePicture:string;
    },
    reviewedAt:Date;
}

export default function fetchIndividualMedicationSupervisoryReviews(individualId:number, medicationObjectId:string, pageNumber:number) {
    return new Promise<IFetchIndividualMedicationSupervisoryReviewResponse>((resolve, reject)=> {
        getIndividualByIndividualId(individualId)
        .then(async (foundIndividual)=> {
            
            const individualMedication = foundIndividual!.medications.filter(medication => medication.medicationId === medicationObjectId);

            if(!individualMedication.length) {
                const notFoundError = new NotFoundError("Medication not found for individual");
                reject(notFoundError)
            }

            const months = ['january', 'feburary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

            const individualMedicationDetails = individualMedication![0];

            const pageSupervisoryReviews = paginateList(individualMedicationDetails.supervisoryReviews, pageNumber, 10)

            const allSupervisoryReviews:IMedicationSupervisoryReviewListItem[] = []

            for await (const supervisoryReview of pageSupervisoryReviews.currentPageList) {
                await getStaffUserById(supervisoryReview.signedBy)
                .then((foundStaff)=> {
                    if(foundStaff) {
                        allSupervisoryReviews.unshift({
                            id: supervisoryReview._id?.toString(),
                            month: months[supervisoryReview.monthIndex],
                            signedBy:{
                                firstname: foundStaff.firstname,
                                lastname: foundStaff.lastname,
                                role: foundStaff.providerRole,
                                profilePicture: foundStaff.profileImage
                            },
                            reviewedAt: supervisoryReview.reviewedAt
                        })
                    }
                })
                .catch((error)=> reject(error))
            }

            resolve({
                currentPage: pageSupervisoryReviews.currentPageNumber,
                totalPages: pageSupervisoryReviews.totalPageNumber,
                medicationId: individualMedicationDetails.medicationId,
                supervisoryReviews: allSupervisoryReviews,
                lastMonthReviewed: individualMedicationDetails.supervisoryReviews[individualMedicationDetails.supervisoryReviews.length-1]?.monthIndex ?? undefined
            });
        })
        .catch((error)=> reject(error))
    })
}