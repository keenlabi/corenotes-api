import { ObjectId } from "mongoose";
import { IUser } from "../../../features/user/models/types";
import userModel from "../../../features/user/models/user.model";
import { NotFoundError } from "@globals/server/Error";

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
            if(!foundUser) {
                const notFoundError = new NotFoundError('User not found');
                reject(notFoundError);
            }
            resolve({ 
                id: foundUser._id.toString(), 
                email: foundUser.email, 
                firstname: foundUser.firstname 
            });
        })
        .catch((error)=> reject(error))
    })
}