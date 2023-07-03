import validateToken from "@globals/middlewares/validateToken";
import { Router } from "express";
import serviceControllers from "./controllers";

const serviceRouter = Router();

serviceRouter.get('/provided/:pageNumber', validateToken, serviceControllers.fetchProvidedServices);
serviceRouter.get('/details/:serviceId', validateToken, serviceControllers.fetchServiceDetails);
serviceRouter.get('/:pageNumber', validateToken, serviceControllers.fetchServices);

serviceRouter.post('/', validateToken, serviceControllers.createService);


export default serviceRouter;