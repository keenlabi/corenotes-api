import UserModel from "@user/models/user.model";

export default async function emailExists(email:string) {
    return UserModel
    .findOne({ email: email })
    .then((foundEmail:any)=> {
        if(foundEmail) return true;
        else return false;
    })
    .catch((error:any)=> {
        console.error(`There was an error finding user with this email ${email}, try again \n`, error);
        return false;
    })
}