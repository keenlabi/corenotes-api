export interface ICreatePrivilegeRequest {
    title:string;
}

export default function validateCreatePrivilegeRequest(requestBody:ICreatePrivilegeRequest) {
    return new Promise<ICreatePrivilegeRequest>((resolve, reject)=> {
        // check if any field is empty and return error if true
        if(Object.keys(requestBody).length === 0) reject({ code: 422, message:'Input fields cannot be empty' })

        if(!requestBody.title) reject({ code: 422, message:'Service title field cannot be empty' })

        // return success if true
        resolve(requestBody);
    });
}