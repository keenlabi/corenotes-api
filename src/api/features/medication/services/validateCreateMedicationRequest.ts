export interface ICreateMedicationRequest {
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
    amount:number;
}

export default function validateCreateMedicationRequest(data:ICreateMedicationRequest) {
    return new Promise<ICreateMedicationRequest>((resolve, reject)=> {
        if(!Object.keys(data).length) reject({ code:401, message:"Request body cannot be empty" });

        if(!data.name) reject({ code:401, message:"Name field cannot be empty" });
        if(!data.strength) reject({ code:401, message:"Strength field cannot be empty" });
        if(!data.route) reject({ code:401, message:"Route field cannot be empty" });
        if(!data.medType) reject({ code:401, message:"Med type cannot be empty" });
        if(!data.indications) reject({ code:401, message:"Indications field cannot be empty" });
        if(!data.providers.length) reject({ code:401, message:"Providers field cannot be empty" });
        if(!data.pharmarcy) reject({ code:401, message:"Pharmarcy field cannot be empty" });
        if(!data.prescriber) reject({ code:401, message:"Prescriber field cannot be empty" });
        if(!data.instructions) reject({ code:401, message:"Instructions field cannot be empty" });
        if(!data.category) reject({ code:401, message:"Category field cannot be empty" });

        resolve(data)
    })
}