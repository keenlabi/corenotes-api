export interface ILoginRequestBodyType {
    username:string,
    password:string,
    latitude:number,
    longitude:number
}

export interface validateLoginRequestBodyType {
    status:boolean, 
    code:number, 
    message: 'SUCCESS'|string,
    requestBody: ILoginRequestBodyType
}

export interface ILogOutRequestBodyType {
    latitude:number,
    longitude:number
}


export interface IValidateLogOutRequestBodyType {
    status:boolean, 
    code:number, 
    message: 'SUCCESS'|string,
    requestBody: ILogOutRequestBodyType
}