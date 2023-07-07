import { getStaffRoleById } from "@services/db/staff.service"

interface IFetchStaffRoleDetails {
    id:string;
    title:string;
    privileges:object;
}

export default function getStaffRoleDetailsById(roleId:string) {
    return new Promise<IFetchStaffRoleDetails>((resolve, reject)=> {
        getStaffRoleById(roleId)
        .then((staffRole)=> {
            resolve({
                id: staffRole._id.toString(),
                title: staffRole.title,
                privileges: staffRole.privileges
            })
        })
        .catch((error)=> reject(error))
    })
}