import { Router } from "express"
import authRouter from "./authRouter";
import staffRouter from "./staffRouter";

export default function routes (){
    const router = Router();

    router.use('/auth', authRouter)
    router.use('/staffs', staffRouter)

    return router
}