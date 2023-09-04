import validateToken from "@globals/middlewares/validateToken";
import { Router } from "express";
import serviceControllers from "./controllers";

const serviceRouter = Router();

serviceRouter.get('/:serviceObjectId/medications/:pageNumber', validateToken, serviceControllers.fetchServiceMedications);
serviceRouter.get('/category/:category/:pageNumber', validateToken, serviceControllers.fetchServicesByCategory);
serviceRouter.get('/provided/:pageNumber', validateToken, serviceControllers.fetchProvidedServices);
serviceRouter.get('/:serviceId/individuals/:pageNumber', validateToken, serviceControllers.fetchServiceIndividuals);
serviceRouter.get('/:serviceId/details', validateToken, serviceControllers.fetchServiceDetails);
serviceRouter.get('/:pageNumber', validateToken, serviceControllers.fetchServices);

serviceRouter.post('/', validateToken, serviceControllers.createService);


export default serviceRouter;