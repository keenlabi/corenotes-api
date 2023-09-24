import staffModel from "@staff/model/staff.model"
import { IStaffDocument } from "@staff/model/types";

export default function clockStaffOutByObjId(staffObjId:string) {
    return new Promise<IStaffDocument>((resolve, reject)=> {
        
        const query = { _id: staffObjId  };
        const updateObj = { $set: { isClockedIn: false }  };

        staffModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedStaff)=> resolve(updatedStaff))
        .catch((error)=> reject(error))
    })
}