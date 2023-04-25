import { UserModel } from "../../models/index";
import { sendFailureResponse, sendSuccessResponse } from "../serverUtils/response";



export async function emailExistsForEndpoint (req:any, res:any) {
    const query = { email: req.params.email }

    return UserModel
    .findOne(query)
    .then((foundEmail:any)=> {
        if(foundEmail) sendFailureResponse(res, 409, 'Email has already been registered');
        else sendSuccessResponse(res, 200, 'Email is available', { email: query.email });
    })
    .catch((error:any)=> {
        console.log(error)
        sendFailureResponse(res, 500, `There was an error finding user with this email ${query.email}, try again`);
    })
}


export async function emailExists(email:string) {
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

export function isEmailValid (email:string) {
    const EmailRegEx = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if(EmailRegEx.test(email)) return true
    return false;
}
