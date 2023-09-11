export interface loginRequestBodyType {
    username:string,
    password:string,
    latitude:number,
    longitude:number
}

export interface validateLoginRequestBodyType {
    status:boolean, 
    code:number, 
    message: 'SUCCESS'|string,
    requestBody: loginRequestBodyType
}

export interface logOutRequestBodyType {
    latitude:number,
    longitude:number
}


export interface validateLogOutRequestBodyType {
    status:boolean, 
    code:number, 
    message: 'SUCCESS'|string,
    requestBody: logOutRequestBodyType
}