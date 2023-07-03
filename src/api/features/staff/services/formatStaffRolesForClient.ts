import { IStaffRole } from "../model/types";

export interface IStaffRoleForClient {
    id:string;
    title:string;
}

export default function formatStaffRolesForClient(staffRoles:Array<IStaffRole>) {
    return new Promise<Array<IStaffRoleForClient>>((resolve, reject)=> {
        resolve(staffRoles.map(staffRole => ({
            id: staffRole._id.toString(),
            title: staffRole.title
        })))
    })
}