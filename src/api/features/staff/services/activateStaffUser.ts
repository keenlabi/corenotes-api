import staffModel from "@staff/model/staff.model"
import { IStaffDocument } from "@staff/model/types";
import userModel from "@user/models/user.model";

export default function activateStaffUser(staffId:number) {
    return new Promise<IStaffDocument>((resolve, reject)=> {
        
        const query = { staffId: staffId };
        const updateObj = { $set: { active: true } };

        staffModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedStaff:IStaffDocument)=> {

            const userQuery = { staff: updatedStaff.id };
            
            userModel.findOneAndUpdate(userQuery, updateObj, { new: true })
            .then(()=> {
                updatedStaff.password = undefined;
                resolve(updatedStaff)
            })
            .catch((error)=> reject(error))
        })
    })
}