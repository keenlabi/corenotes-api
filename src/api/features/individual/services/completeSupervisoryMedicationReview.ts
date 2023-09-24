import { NotFoundError } from "@globals/server/Error";
import { individualModel } from "@individual/models/individual.model";
import { IIndividualDocument } from "@individual/models/types";
import { getIndividualByIndividualId } from "src/api/shared/services/db/individual.service";
import { getMedicationByMedicationId } from "src/api/shared/services/db/medication.service";
import { Types } from "mongoose";

export default function completeSupervisoryMedicationReview({
    individualId, medicationId, newPharmacy, newAllocatedAmount, staffObjectId

}:{individualId:number, medicationId:string, newPharmacy:string, newAllocatedAmount:number, staffObjectId?:string}) {
    return new Promise<IIndividualDocument|null>((resolve, reject)=> {
        getIndividualByIndividualId(individualId)
        .then((foundIndividual)=> {

            if(!foundIndividual) {
                const notFoundError = new NotFoundError('Individual profile not found');
                reject(notFoundError)
            }

            getMedicationByMedicationId(parseInt(medicationId))
            .then((foundMedication)=> {

                if(!foundMedication) {
                    const notFoundError = new NotFoundError('medication details not found');
                    reject(notFoundError)
                }

                const medicationToUpdate = foundIndividual!.medications.filter(medication => medication.medicationId === foundMedication?._id.toString())[0]
            
                const query = { individualId, "medications.medicationId": foundMedication?._id.toString() };

                const totalAllocatedAmount = medicationToUpdate.amount.allocated + newAllocatedAmount;
                const totalCurrentAmount = medicationToUpdate.amount.current + newAllocatedAmount;

                const calcCurrentMonthIndex = new Date().getUTCMonth();

                // get the month of the last completed review
                const lastReviewMonthDateIndex = medicationToUpdate.supervisoryReviews[medicationToUpdate.supervisoryReviews?.length-1]?.monthIndex;

                const review = { 
                    _id: new Types.ObjectId(),
                    monthIndex: lastReviewMonthDateIndex ? lastReviewMonthDateIndex + 1 :calcCurrentMonthIndex,
                    signedBy: staffObjectId,
                    dateReviewed: Date.now,
                }

                const updateObj = { 
                    $set: {
                        "medications.$.pharmacy": newPharmacy,
                        "medications.$.amount.allocated": totalAllocatedAmount,
                        "medications.$.amount.current": totalCurrentAmount
                    },
                    $push: {
                        "medications.$.supervisoryReviews": review,
                    }
                }

                individualModel.findOneAndUpdate(query, updateObj, { new: true })
                .then((updatedIndividual)=> resolve(updatedIndividual))
                .catch((error)=> reject(error))
            })
        })
        .catch((error)=> reject(error))
    })
}