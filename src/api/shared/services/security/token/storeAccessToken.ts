import staffModel from "@staff/model/staff.model";
import { IStaffDocument } from "@staff/model/types";

export default function storeAuthToken (id:string, token:string) {
    return new Promise<IStaffDocument>((resolve, reject)=> {
        const query = { _id: id }, updateObj = { $set: { accessToken: token } };
        
        staffModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedUser)=> {
            console.log(`Auth token successfully stored for user ${id}`)
            resolve(updatedUser);
        })
        .catch((error)=> {
            console.log("There was an error storing user auth token: ", error);
            reject("There was an error storing user auth token")
        })
    });
}