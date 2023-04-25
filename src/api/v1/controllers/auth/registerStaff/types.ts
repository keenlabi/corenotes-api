export interface registerStaffRequestBodyType {
    email:string,
    phoneNumber:string,
    firstname:string,
    lastname:string,
    role:'STAFF'|'INDIVIDUAL',
    password:string
}

export interface validateRegisterStaffRequestBodyType {
    status:boolean, 
    code:number, 
    message: 'SUCCESS'|string
}