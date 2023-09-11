import { Router } from "express";
import login from "../controllers/login";
import logOut from "@auth/controllers/logout";
import validateToken from "@globals/middlewares/validateToken";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/logout", validateToken, logOut);

export default authRouter;
