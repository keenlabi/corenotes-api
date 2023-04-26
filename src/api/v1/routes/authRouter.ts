import { Router } from "express";
import login from "v1/controllers/auth/login/login";
import registerStaff from "v1/controllers/auth/registerStaff/registerStaff";

const authRouter = Router();

authRouter.post('/login', login)
authRouter.post('/register-staff', registerStaff)

export default authRouter;