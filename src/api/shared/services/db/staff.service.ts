import staffroleModel from "src/api/features/staff/model/staffrole.model";
import { IStaffRole } from "src/api/features/staff/model/types";

export function getStaffRoleById(staffRoleId:string) {
    return new Promise<IStaffRole>((resolve, reject)=> {
        const query = { _id: staffRoleId };
    
        staffroleModel.findOne(query)
        .then((foundStaffRole:IStaffRole)=> {
            resolve(foundStaffRole)
        })
        .catch((error)=> reject(error))
    })
}