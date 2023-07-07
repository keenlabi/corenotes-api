import staffroleModel from "../../model/staffrole.model";

export interface INewStaffRole {
    title:string;
    privileges:any
}

export default function insertStaffRoleToDB(staffRole:INewStaffRole) {
    return new Promise<INewStaffRole>((resolve, reject)=> {
        staffroleModel.create({
            title: staffRole.title,
            privileges: staffRole.privileges
        })
        .then((createdStaffRole)=> resolve(createdStaffRole))
        .catch((error)=> reject(error))
    });
}