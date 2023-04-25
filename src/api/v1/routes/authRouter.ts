import { Router } from "express";
import registerStaff from "v1/controllers/auth/registerStaff/registerStaff";

const authRouter = Router();

authRouter.post('/login')
authRouter.post('/register-staff', registerStaff)

export default authRouter;