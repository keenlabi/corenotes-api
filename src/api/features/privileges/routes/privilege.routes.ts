import validateToken from "@globals/middlewares/validateToken";
import { Router } from "express";
import privilegeControllers from "../controllers";

const privilegeRouter = Router();

privilegeRouter.get('/:pageNumber', validateToken, privilegeControllers.fetchPrivileges);
privilegeRouter.post('/', validateToken, privilegeControllers.createPrivilege);


export default privilegeRouter;