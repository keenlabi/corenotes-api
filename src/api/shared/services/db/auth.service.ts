import { ObjectId } from "mongoose";
import { IUser } from "../../../features/user/models/types";
import userModel from "../../../features/user/models/user.model";

export function getAuthUserById(id:string) {
    return new Promise<IUser>((resolve, reject)=> {
        userModel.findOne({ _id: id })
        .then((foundUser:IUser)=> resolve(foundUser))
        .catch((error)=> reject(error))
    });
}

export function getAuthUserByEmail(email:string) {
    return new Promise<IUser>((resolve, reject)=> {
        userModel.findOne({email})
        .then((foundUser:IUser)=> resolve(foundUser))
        .catch((error)=> reject(error))
    });
}

export function getAuthUserByUsername(username:string) {
    return new Promise<IUser>((resolve, reject)=> {
        userModel.findOne({username})
        .then((foundUser:IUser)=> resolve(foundUser))
        .catch((error)=> reject(error))
    });
}

export function getAuthUserByEmailOrUsername(data:string) {
    return new Promise<IUser>((resolve, reject)=> {
        const query = {
            $or: [
                { username: data.toLowerCase() },
                { email: data.toLowerCase() }
            ]
        };

        userModel.findOne(query)
        .then((foundUser:IUser)=> resolve(foundUser))
        .catch((error)=> reject(error))
    });
}

export function getAuthUserByAuthAccessToken(userDocumentId:ObjectId, accessToken:string) {
    return new Promise<{ id:string, email:string, firstname:string }>((resolve, reject)=> {
        const query = {
            $and: [
                { _id: userDocumentId },
                { accessToken }
            ]
        };

        userModel.findOne(query)
        .then((foundUser:IUser)=> {
            if(foundUser) resolve({ id: foundUser.id.toString(), email: foundUser.email, firstname: foundUser.firstname });
            reject();
        })
        .catch(()=> reject())
    })
}