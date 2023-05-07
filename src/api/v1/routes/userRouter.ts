import { Router } from "express";
import fetchProfile from "v1/controllers/user/profile/fetchProfile";
import validateToken from "v1/middlewares/auth/validateToken";

const userRouter = Router();

userRouter.get('/profile', validateToken, fetchProfile);

export default userRouter 