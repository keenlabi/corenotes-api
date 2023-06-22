declare global {
    namespace Express {
        interface Request {
            currentUser: {
                id?:string;
                email?:string;
                firstname?:string;
                role?:string;
                cookie?:string;
            }
        }
    }
}

export {};