import { IUserDocument } from "@user/models/types"
import userModel from "@user/models/user.model"

export default function getUserByObjectId(userId:string) {
    return new Promise<IUserDocument>((resolve, reject)=> {
        userModel.findOne({ _id: userId })
        .then((foundUser:IUserDocument)=> resolve(foundUser))
        .catch((error)=> reject(error))
    })
}