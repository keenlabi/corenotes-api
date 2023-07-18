import validateToken from "@globals/middlewares/validateToken";
import { Router } from "express";
import { medicationControllers } from "./controllers";

const medicationRouter = Router();

medicationRouter.get('/:medicationId/individuals', validateToken, medicationControllers.fetchMedicationIndividuals);

medicationRouter.patch('/:medicationId/services', validateToken, medicationControllers.postMedicationToService);

medicationRouter.get('/details/:medicationId', validateToken, medicationControllers.fetchMedicationDetails);

medicationRouter.post('/', validateToken, medicationControllers.createMedication);
medicationRouter.get('/:pageNumber', validateToken, medicationControllers.fetchMedications);



export default medicationRouter;