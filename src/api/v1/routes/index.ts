import { Router } from "express"
import authRouter from "./authRouter";
import staffRouter from "./staffRouter";
import userRouter from "./userRouter";
import individualRouter from "./individualRouter";
import assessmentRouter from "./assessmentRouter";

export default function routes (){
    const router = Router();

    router.use('/auth', authRouter)
    router.use('/user', userRouter);
    router.use('/staffs', staffRouter)
    router.use('/individuals', individualRouter)
    router.use('/assessments', assessmentRouter)

    return router
}