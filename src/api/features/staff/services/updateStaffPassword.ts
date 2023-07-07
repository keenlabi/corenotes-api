import staffModel from "@staff/model/staff.model"
import { IStaffDocument } from "@staff/model/types"

export default function updateStaffPassword(staffId:number, newPassword:string) {
    return new Promise<IStaffDocument>((resolve, reject)=> {

        const query = { staffId: staffId }
        const updateObj = { $set: { password: newPassword } }

        staffModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedStaff:IStaffDocument)=> {

            console.log("STAFF's password has been updated successfully")
            resolve(updatedStaff)

        })
        .catch((error)=> reject(error))
    })
}