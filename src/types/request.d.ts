declare global {
    namespace Express {
        interface Request {
            userId?:string,
            role?:string
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}