import staffModel from "@staff/model/staff.model";
import staffroleModel from "src/api/features/staff/model/staffrole.model";
import { IStaffDocument, IStaffRole } from "src/api/features/staff/model/types";

export function getStaffUserByUserId(userId:string) {
    return new Promise<IStaffDocument>((resolve, reject)=> {
        const query = { user: userId };

        staffModel.findOne(query)
        .then((foundStaffUser:IStaffDocument)=> resolve(foundStaffUser))
        .catch((error)=> reject(error))
    })
}

export function getStaffUserByStaffId(staffId:number) {
    return new Promise<IStaffDocument>((resolve, reject)=> {
        const query = { staffId: staffId };
    
        staffModel.findOne(query)
        .then((foundStaffUser:IStaffDocument)=> resolve(foundStaffUser))
        .catch((error)=> reject(error))
    })
}

export function getStaffUserById(staffObjectId:string) {
    return new Promise<IStaffDocument|null>((resolve, reject)=> {
        const query = { _id: staffObjectId };
    
        staffModel.findOne(query)
        .then((foundStaffUser)=> resolve(foundStaffUser))
        .catch((error)=> reject(error))
    })
}

export function getStaffUserByUsername(username:string) {
    return new Promise<IStaffDocument>((resolve, reject)=> {
        const query = { username };
    
        staffModel.findOne(query)
        .then((foundStaffUser:IStaffDocument)=> resolve(foundStaffUser))
        .catch((error)=> reject(error))
    })
}

export function getStaffRoleById(staffRoleId:string) {
    return new Promise<IStaffRole>((resolve, reject)=> {
        const query = { _id: staffRoleId };
    
        staffroleModel.findOne(query)
        .then((foundStaffRole:IStaffRole)=> resolve(foundStaffRole))
        .catch((error)=> reject(error))
    })
}

export function updateStaffLastSeenById(staffObjectId:string) {
    return new Promise<IStaffDocument>((resolve, reject)=> {
        const query = { _id: staffObjectId }
        const updateObject = { $set: { lastSeen: Date.now }  }

        staffModel.findOneAndUpdate(query, updateObject, { new: true })
        .then((updatedStaff)=> resolve(updatedStaff))
        .catch((error)=> reject(error))
    })
}