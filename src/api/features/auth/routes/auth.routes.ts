import { Router } from "express";
import login from "../controllers/login";
import validateToken from "@globals/middlewares/validateToken";
import logout from "@auth/controllers/logout";

const authRouter = Router();

authRouter.post('/login', login)
authRouter.post('/logout', validateToken, logout)

export default authRouter;