import { Router } from "express";
import login from "api/v1/controllers/auth/login/login";

const authRouter = Router();

authRouter.post('/login', login)

export default authRouter;