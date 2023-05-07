import { UserModel } from "v1/models";
import { IUser } from "v1/models/UserModel/types";

export default function storeAuthToken (id:string, token:string) {
    return new Promise<IUser>((resolve, reject)=> {
        const query = { _id: id };
        
        UserModel.findOneAndUpdate(
            query,
            {
                $set: {
                    accessToken: token,
                    lastSeen: Date.now()
                }
            },
            { new: true }

        ).then((updatedUser:IUser)=> {
            console.log(`Auth token successfully stored for user ${id}`)
            resolve(updatedUser);
        })
        .catch((error)=> {
            console.log("There was an error storing user auth token: ", error);
            reject("There was an error storing user auth token")
        })
    });
}