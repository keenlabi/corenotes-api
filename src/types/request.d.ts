declare global {
    namespace Express {
        interface Request {
            currentUser: {
                id?:string;
                staffObjectId?:string;
                staffId?:number;
                email?:string;
                firstname?:string;
                role?:string;
                cookie?:string;
            }
        }
    }
}

export {};