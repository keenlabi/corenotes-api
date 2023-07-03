import staffroleModel from "../../model/staffrole.model";

export interface INewStaffRole {
    title:string;
}

export default function insertStaffRoleToDB(staffRole:INewStaffRole) {
    return new Promise<INewStaffRole>((resolve, reject)=> {
        staffroleModel.create(staffRole)
        .then((createdStaffRole)=> resolve(createdStaffRole))
        .catch((error)=> reject(error))
    });
}