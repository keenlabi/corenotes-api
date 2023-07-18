import validateToken from "@globals/middlewares/validateToken";
import { Router } from "express";
import getTasks from "./controllers/getTasks";
import getTask from "./controllers/getTask";

const taskRouter = Router();

taskRouter.get('/:taskId/details', validateToken, getTask);
taskRouter.get('/:pageNumber', validateToken, getTasks);

export default taskRouter;