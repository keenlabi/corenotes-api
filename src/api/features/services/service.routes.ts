import validateToken from "@globals/middlewares/validateToken";
import { Router } from "express";
import serviceControllers from "./controllers";

const serviceRouter = Router();

serviceRouter.get('/:pageNumber', validateToken, serviceControllers.fetchServices);
serviceRouter.post('/', validateToken, serviceControllers.createService);
serviceRouter.get('/details/:serviceId', validateToken, serviceControllers.fetchServiceDetails);

export default serviceRouter;