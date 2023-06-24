import { scrypt, randomBytes } from "crypto";

const hashPassword = (password:string)=> {
    return new Promise<string>((resolve, reject)=> {

        // generate random salt, 16 bytes long
        const salt = randomBytes(16).toString('hex');

        scrypt(password, salt, 64, (err, derivedKey)=> {
            if(err) reject(err)
            resolve(`${salt}:${derivedKey.toString('hex')}`)
        })
    });
}

const verifyPassword = (inputedPwd:string, hashedPassword:string)=> {
    return new Promise<boolean>((resolve, reject)=> {
        // seperate the salt from the key
        const [salt, key] = hashedPassword.split(':');
        scrypt(inputedPwd, salt, 64, (err, derivedKey)=> {
            if(err) reject(err)
            resolve(key === derivedKey.toString('hex'))
        })
    });
}

export { hashPassword, verifyPassword }