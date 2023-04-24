import { Router } from "express"
import authRouter from "./authRouter";

export default function routes (){
    const router = Router();

    router.use('/auth', authRouter)

    return router
}