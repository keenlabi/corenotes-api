export interface loginRequestBodyType {
    email:string,
    password:string
}

export interface validateLoginRequestBodyType {
    status:boolean, 
    code:number, 
    message: 'SUCCESS'|string,
    requestBody: loginRequestBodyType
}