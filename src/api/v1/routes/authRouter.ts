import { Router } from "express";

const authRouter = Router();

authRouter.post('/login')
authRouter.post('/register-staff')

export default authRouter;