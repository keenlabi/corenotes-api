import generateOTP from "../../globals/helpers/OTP/generateOTP";
import verificationModel from "../../../features/auth/models/verification.model";
import { IVerification } from "../../../features/auth/models/types";
import otpIsExpired from "../../globals/helpers/OTP/otpIsExpired";

export function validateEmailVerification(email: string, code:string) {
    return new Promise<{status:'SUCCESS'|'FAILED'; email?:string; code?:string}>((resolve, reject)=> {
        const query = { email, code }

        verificationModel.findOne(query)
        .then((foundEmailVerification:IVerification)=> {
            if(!foundEmailVerification) resolve({status:'FAILED'})
            if(otpIsExpired(foundEmailVerification.createdAt.toString(), 10 /** minutes */)) resolve({status:'FAILED'})

            resolve({
                status:"SUCCESS",
                email: foundEmailVerification.email!,
                code: foundEmailVerification.code
            })
        })
        .catch(()=> reject())
    })
}

export function createEmailVerification(email:string) {
    return new Promise<{email:string, code:string}>((resolve, reject)=> {
        
        const query = { email }

        verificationModel.findOne(query)
        .then((foundVerification:IVerification)=> {
            if(foundVerification) {
                validateEmailVerification(foundVerification.email!, foundVerification.code!)
                .then((verificationResult)=> {
                    if(verificationResult.status === 'SUCCESS') {
                        resolve({ 
                            email: verificationResult.email!, 
                            code: verificationResult.code! 
                        })
                        
                    } else{
                        let count = 0;
                        verificationModel.deleteOne(query)
                        .then(()=> {
                            // generate verification code
                            const newOTP:string = generateOTP();

                            verificationModel.create({
                                email: email,
                                category: 'EMAIL_VERIFICATION',
                                code: newOTP
                            })
                            .then((newEmailVerification:IVerification)=> {
                                resolve({ 
                                    email: newEmailVerification.email!, 
                                    code: newEmailVerification.code 
                                })
                            })
                            .catch((error)=> reject(error))
                        })
                        .catch((error)=> {
                            count++;
                            if(count < 5) createEmailVerification(email);
                            else reject(error)
                        })
                    }
                })
                .catch(()=> reject())
            } else {
            
                // generate verification code
                const newOTP:string = generateOTP();

                verificationModel.create({
                    email: email,
                    category: 'EMAIL_VERIFICATION',
                    code: newOTP
                })
                .then((newEmailVerification:IVerification)=> {
                    resolve({ 
                        email: newEmailVerification.email!, 
                        code: newEmailVerification.code 
                    })
                })
                .catch((error)=> reject(error))
            }
        })
        .catch((error)=> reject(error))
    })
}

export function createSMSVerification(phone:number) {
    return new Promise<{phone:number, code:string}>((resolve, reject)=> {
        
        const query = { phone }

        verificationModel.findOne(query)
        .then((foundVerification:IVerification)=> {
            if(foundVerification) {
                validateSMSVerification(foundVerification.phone!, foundVerification.code!)
                .then((verificationResult)=> {
                    if(verificationResult.status === 'SUCCESS') {
                        resolve({ 
                            phone: verificationResult.phone!, 
                            code: verificationResult.code! 
                        })
                        
                    } else{
                        let count = 0;
                        verificationModel.deleteOne(query)
                        .then(()=> {
                            // generate verification code
                            const newOTP:string = generateOTP();

                            verificationModel.create({
                                phone: phone,
                                category: 'SMS_VERIFICATION',
                                code: newOTP
                            })
                            .then((newEmailVerification:IVerification)=> {
                                resolve({ 
                                    phone: newEmailVerification.phone!, 
                                    code: newEmailVerification.code 
                                })
                            })
                            .catch((error)=> reject(error))
                        })
                        .catch((error)=> {
                            count++;
                            if(count < 5) createSMSVerification(phone);
                            else reject(error)
                        })
                    }
                })
                .catch(()=> reject())
            } else {
            
                // generate verification code
                const newOTP:string = generateOTP();

                verificationModel.create({
                    phone: phone,
                    category: 'EMAIL_VERIFICATION',
                    code: newOTP
                })
                .then((newEmailVerification:IVerification)=> {
                    resolve({ 
                        phone: newEmailVerification.phone!, 
                        code: newEmailVerification.code 
                    })
                })
                .catch((error)=> reject(error))
            }
        })
        .catch((error)=> reject(error))
    })
}

export function validateSMSVerification(phone:number, code:string) {
    return new Promise<{status:'SUCCESS'|'FAILED'; phone?:number; code?:string}>((resolve, reject)=> {
        
        const query = { phone, code }

        verificationModel.findOne(query)
        .then((foundEmailVerification:IVerification)=> {
            if(!foundEmailVerification) resolve({status:'FAILED'})
            if(otpIsExpired(foundEmailVerification.createdAt.toString(), 10 /** minutes */)) resolve({status:'FAILED'})

            resolve({
                status:"SUCCESS",
                phone: foundEmailVerification.phone!,
                code: foundEmailVerification.code
            })
        })
        .catch(()=> reject())
    })
}