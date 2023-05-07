import { Response } from "express"
import { sign } from "jsonwebtoken"

export default function generateToken (id:string, res:Response) {
    return new Promise<string>((resolve, reject)=> {
        try {
            const token = sign({ id }, process.env.JWT_KEY!, {
                expiresIn: parseInt(process.env.SESSION_EXP!)
            });
            res.cookie('sid', token, { httpOnly: true });
            resolve(token);

        } catch(error) {
            reject(error);
        }
    });
}