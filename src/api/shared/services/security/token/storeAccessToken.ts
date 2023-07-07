import { IUserDocument } from "@user/models/types";
import userModel from "@user/models/user.model";


export default function storeAuthToken (id:string, token:string) {
    return new Promise<IUserDocument>((resolve, reject)=> {
        const query = { _id: id };
        
        userModel.findOneAndUpdate(
            query,
            {
                $set: {
                    accessToken: token,
                    lastSeen: Date.now()
                }
            },
            { new: true }

        ).then((updatedUser:IUserDocument)=> {
            console.log(`Auth token successfully stored for user ${id}`)
            resolve(updatedUser);
        })
        .catch((error)=> {
            console.log("There was an error storing user auth token: ", error);
            reject("There was an error storing user auth token")
        })
    });
}