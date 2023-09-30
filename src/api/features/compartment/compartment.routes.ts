import { Router } from "express";
import validateToken from "@globals/middlewares/validateToken";
import compartmentControllers from "./controllers";
import uploadFile from "@globals/middlewares/uploadFile";
import patchServiceToCompartment from "./controllers/patchServiceToCompartment";

const compartmentRouter = Router();

compartmentRouter.post('/:compartmentId', validateToken, compartmentControllers.createSubcompartment);
compartmentRouter.patch('/:compartmentId/services', patchServiceToCompartment);
compartmentRouter.get('/:compartmentId/services', validateToken, compartmentControllers.fetchCompartmentServices);

compartmentRouter.get('/:pageNumber', validateToken, compartmentControllers.fetchCompartments);
compartmentRouter.post('/', validateToken, uploadFile('single', 'compartmentImage'), compartmentControllers.createCompartment);

compartmentRouter.get('/details/:compartmentId', validateToken, compartmentControllers.fetchCompartmentDetails);

export default compartmentRouter;