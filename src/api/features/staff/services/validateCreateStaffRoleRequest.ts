import { INewStaffRole } from "./db/insertStaffRoleToDB";

interface ICreateStaffRoleRequestBody {
    title:string;
    privileges:{unknown:any}
}

export default function validateCreateStaffRoleRequest(data:ICreateStaffRoleRequestBody) {
    return new Promise<INewStaffRole>((resolve, reject)=> {
        // check if any field is empty and return error if true
        if(Object.keys(data).length === 0) reject({ code: 422, message:'Input fields cannot be empty' })

        if(!data.title) reject({ code: 422, message:'Service title field cannot be empty' })

        const newData:INewStaffRole = Object.freeze({
            title: data.title,
            privileges: data.privileges
        })

        resolve(newData)
    })
} 