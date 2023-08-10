import { getIndividualByIndividualId } from "@services/db/individual.service"
import { getMedicationByObjectId } from "@services/db/medication.service";
import detMedSchedule from "./detMedSchedule";
import { NotFoundError } from "@globals/server/Error";

interface IFetchIndividualMedicationsResponse {
    currentPage:number;
    totalPages:number;
    medications:Array<IIndividualMedication>
}

interface IIndividualMedication {
    id:string;
    active:boolean;
    medicationId:number;
    barcode:string;
    name:string;
    category:string;
    strength:string;
    amount:{
        current:number;
        allocated:number;
        administered:number;
    };
    frequency:string;
    time:string;
}

export default function fetchIndividualMedications(individualId:number, pageNumber:number) {
    return new Promise<IFetchIndividualMedicationsResponse>((resolve, reject)=> {
        getIndividualByIndividualId(individualId)
        .then(async (foundIndividual)=> {

            if(!foundIndividual) {
                const notFoundError = new NotFoundError('Individual not found')
                reject(notFoundError)
            }
            
            const   queryPageNumber = pageNumber - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * queryPageNumber,
            pageEndIndex = pageOffset + resultsPerPage;
            
            const medications= foundIndividual!.medications?.slice(pageOffset, pageEndIndex).reverse()!;
            
            const mappedMedications:Array<IIndividualMedication> = [];

            for await ( const medication of medications ) {
                await getMedicationByObjectId(medication.medicationId)
                .then((foundMedication)=> {
                    mappedMedications.push({
                        id: foundMedication?._id.toString()!,
                        active: medication?.active!,
                        medicationId: foundMedication?.medicationId!,
                        barcode: medication.barcode,
                        name: foundMedication?.name!,
                        category: foundMedication?.category!,
                        strength: foundMedication?.strength!,
                        amount:{
                            current: medication?.amount.current!,
                            allocated: medication?.amount.allocated!,
                            administered: medication?.amount.administered!,
                        },
                        frequency: detMedSchedule(medication.schedule.frequency, medication.schedule.startDate, medication.schedule.frequencyAttr),
                        time: medication?.schedule.time
                    })
                })
                
            }

            resolve({
                currentPage: pageNumber,
                totalPages: Math.ceil(foundIndividual!.medications!.length / resultsPerPage),
                medications: mappedMedications
            })

        })
        .catch((error)=> reject(error))
    })
}