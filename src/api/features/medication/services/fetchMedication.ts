import { NotFoundError } from "@globals/server/Error"
import { getMedicationByMedicationId } from "@services/db/medication.service"
import { getServiceByObjectId } from "@services/db/service.service";
import { getIndividualsByMedicationObjectId } from "@services/db/individual.service";

export interface IMedicationDetails {
    id:string;
    medicationId:number;
    name:string;
    strength:string;
    route:string;
    medType:string;
    indications:Array<string>;
    providers:Array<string>;
    pharmarcy:string;
    prescriber:string;
    instructions:string;
    category:string;
    amount:{
        current:number;
        startWith:number;
        administered:number;
    };
    barcode:number;
    services:Array<IMedicationService>;
    createdAt:Date;
}

export interface IMedicationService {
    id:string;
    serviceId:number,
    title:string,
    category:string,
    individualsCount:number
}

export default function fetchMedication(medicationId:number) {
    return new Promise<IMedicationDetails>((resolve, reject)=> {
        getMedicationByMedicationId(medicationId)
        .then(async (foundMedication)=> {
            if(!foundMedication) {
                const notFoundError = new NotFoundError("No medication was found")
                reject(notFoundError)
            }

            const mappedServices:Array<IMedicationService> = []

            for await ( const service of foundMedication?.services! ) {
                const foundService = await getServiceByObjectId(service);

                const foundIndividuals = await getIndividualsByMedicationObjectId(foundMedication?._id.toString()!)
                
                if(foundService) {
                    mappedServices.push({
                        id: foundService._id.toString(),
                        serviceId: foundService.serviceId,
                        title: foundService.title,
                        category: foundService.category,
                        individualsCount: foundIndividuals.length,
                    })
                }
            }

            resolve({
                id: foundMedication?._id.toString()!,
                medicationId: foundMedication?.medicationId!,
                name: foundMedication?.name!,
                strength: foundMedication?.strength!,
                route: foundMedication?.route!,
                medType: foundMedication?.medType!,
                indications: foundMedication?.indications!,
                providers: foundMedication?.providers!,
                pharmarcy: foundMedication?.pharmarcy!,
                prescriber: foundMedication?.prescriber!,
                instructions: foundMedication?.instructions!,
                category: foundMedication?.category!,
                amount:{
                    current: foundMedication?.amount.current!,
                    startWith: foundMedication?.amount.allocated!,
                    administered: foundMedication?.amount.administered!
                },
                barcode: foundMedication?.barcode!,
                services: mappedServices,
                createdAt: foundMedication?.createdAt!
            })
        })
        .catch((error) => reject(error))
    })
}