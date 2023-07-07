export interface registerIndividualRequestBodyType {
    role:'individual',
    firstname: string,
    middlename: string,
    lastname: string,
    nickname: string,
    dob:string,
    gender: string,
    maritalStatus: string,
    religion: string,
    ssn: string,
    weight: string,
    medicaidNumber: string,
    codeAlert: Array<string>,
    profileImage?:Blob|MediaSource,
    contact: {
        name: string,
        email: string,
        phoneNumber: string
    },
    // NEW HEALTH INFORMATION
    compartment:string;
    services: Array<{
        service:string,
        startDate:string
    }>,
    diet: Array<string>,
    allergies: {
        food: Array<string>,
        med: Array<string>,
        other: Array<string>
    }
}

export interface validateRegisterIndividualRequestBodyType {
    status:boolean, 
    code:number, 
    message: 'SUCCESS'|string,
    requestBody: registerIndividualRequestBodyType
}