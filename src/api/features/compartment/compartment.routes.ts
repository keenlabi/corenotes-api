import validateToken from "@globals/middlewares/validateToken";
import { Router } from "express";
import compartmentControllers from "./controllers";
import uploadFile from "@globals/middlewares/uploadFile";

const compartmentRouter = Router();

compartmentRouter.post('/services', compartmentControllers.addServiceToCompartment);

compartmentRouter.get('/:pageNumber', validateToken, compartmentControllers.fetchCompartments);
compartmentRouter.post('/', validateToken, uploadFile('single', 'compartmentImage'), compartmentControllers.createCompartment);

compartmentRouter.get('/details/:compartmentId', validateToken, compartmentControllers.fetchCompartmentDetails);

export default compartmentRouter;