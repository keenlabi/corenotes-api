import validateToken from "@globals/middlewares/validateToken";
import { Router } from "express";
import compartmentControllers from "./controllers";
import uploadFile from "@globals/middlewares/uploadFile";

const compartmentRouter = Router();

compartmentRouter.get('/', validateToken, compartmentControllers.fetchCompartments);
compartmentRouter.post('/', validateToken, uploadFile('single', 'compartmentImage'), compartmentControllers.createCompartment);

export default compartmentRouter;