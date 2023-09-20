import staffModel from "@staff/model/staff.model"
import { IStaffDocument } from "@staff/model/types";
import { IUserDocument } from "@user/models/types";
import userModel from "@user/models/user.model";

export default function deactivateStaffUser(staffId:number) {
    return new Promise<IStaffDocument>((resolve, reject)=> {
        
        const query = { staffId: staffId };
        const updateObj = { $set: { active: false } };

        staffModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedStaff:IStaffDocument)=> {

            const userQuery = { staff: updatedStaff.id };
            
            userModel.findOneAndUpdate(userQuery, updateObj, { new: true })
            .then(()=> {
                resolve(updatedStaff)
            })
            .catch((error)=> reject(error))
        })
    })
}