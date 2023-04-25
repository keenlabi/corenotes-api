import { Request, Response } from "express"
import validateRegisterRequestBody from "./validateRegisterStaffRequestBody"
import { hashPassword } from "../../../utils/authUtils/password"

export default function registerStaff(req:Request, res:Response) {
    validateRegisterRequestBody(req.body)
    .then((response)=> {
        // encrypt user password
        hashPassword(req.body.password)
        .then((hashedPassword)=> {
            console.log(req.body)
            console.log(hashedPassword)
        })
        .catch(()=> {

        })
    })
    .catch((error)=> {
        // TODO: return error if validation is failed
        console.log(`There was an error registering user`)
        res.status(error.code).json({ message: error.message });
    })
}