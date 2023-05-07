import { Router } from "express";
import validateToken from "../middlewares/auth/validateToken";
import fetchProfile from "../controllers/user/profile/fetchProfile";

const userRouter = Router();

userRouter.get('/profile', validateToken, fetchProfile);

export default userRouter 