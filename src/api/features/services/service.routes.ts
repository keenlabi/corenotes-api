import validateToken from "@globals/middlewares/validateToken";
import { Router } from "express";
import serviceControllers from "./controllers";

const serviceRouter = Router();

serviceRouter.get('/', validateToken, serviceControllers.fetchServices);
serviceRouter.post('/', validateToken, serviceControllers.createService);

export default serviceRouter;