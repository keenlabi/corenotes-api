import { UserModel } from "v1/models";

export async function phoneExists(phoneNumber:string) {
    return UserModel
    .findOne({ phoneNumber: phoneNumber })
    .then((foundPhone:any)=> {
        if(foundPhone) return true;
        else return false;
    })
    .catch((error:any)=> {
        console.error(`There was an error finding user with this phone number ${phoneNumber}, try again \n`, error);
        return false;
    })
}
