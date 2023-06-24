import { Router } from "express";
import authRouter from "./features/auth/routes/auth.routes";
import userRouter from "./features/user/routes/user.routes";
import staffRouter from "./features/staff/routes/staff.routes";
import individualRouter from "./features/individual/routes/individual.routes";
import assessmentRouter from "./features/assessment/routes/assessment.routes";
import compartmentRouter from "./features/compartment/compartment.routes";
import serviceRouter from "./features/services/service.routes";

export default function routes() {
    const router = Router();

    router.use('/auth', authRouter);
    router.use('/user', userRouter);
    router.use('/staffs', staffRouter);
    router.use('/individuals', individualRouter);
    router.use('/assessments', assessmentRouter);
    router.use('/compartments', compartmentRouter);
    router.use('/services', serviceRouter);

    return router;
}