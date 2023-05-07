import { Router } from "express";
import fetchProfile from "api/v1/controllers/user/profile/fetchProfile";
import validateToken from "api/v1/middlewares/auth/validateToken";

const userRouter = Router();

userRouter.get('/profile', validateToken, fetchProfile);

export default userRouter 