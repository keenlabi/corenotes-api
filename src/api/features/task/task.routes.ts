import validateToken from "@globals/middlewares/validateToken";
import { Router } from "express";
import getTasks from "./controllers/getTasks";
import getTask from "./controllers/getTask";
import administerMedicationTask from "./controllers/medication/administerMedicationTask";
import uploadFile from "@globals/middlewares/uploadFile";
import findMedicationTaskByBarcode from "./controllers/medication/findMedicationTaskByBarcode";
import administerUncontrolledMedicationTask from "./controllers/medication/administerUncontrolledMedicationTask";
import completeGoalTrackingService from "./controllers/goal-tracking/completeGoalTrackingTask";
import declineGoalTrackingTask from "./controllers/goal-tracking/declineGoalTrackingTask";
import declineSkinIntegrityTask from "./controllers/skin-integrity/declineSkinIntegrityTask";
import completeSkinIntegrityTask from "./controllers/skin-integrity/completeSkinIntegrityTask";
import declineBowelMovementTask from "./controllers/bowel-movement/declineBowelMovementTask";
import completeBowelMovementTask from "./controllers/bowel-movement/completeBowelMovementTask";

const taskRouter = Router();

taskRouter.post('/:taskId/decline-bowel-movement', validateToken, declineBowelMovementTask)
taskRouter.post('/:taskId/complete-bowel-movement', validateToken, completeBowelMovementTask)

taskRouter.post('/:taskId/decline-skin-integrity', validateToken, declineSkinIntegrityTask)
taskRouter.post('/:taskId/complete-skin-integrity', validateToken, completeSkinIntegrityTask)

taskRouter.post('/:taskId/decline-goal-tracking', validateToken, declineGoalTrackingTask)
taskRouter.post('/:taskId/complete-goal-tracking', validateToken, completeGoalTrackingService)

taskRouter.get('/medications/search-by-barcode/:barcode', validateToken, findMedicationTaskByBarcode);

taskRouter.patch('/:taskId/administer', validateToken, administerMedicationTask);
taskRouter.patch('/:taskId/administer-uncontrolled', uploadFile('single', 'topicalPhoto'), validateToken, administerUncontrolledMedicationTask);

taskRouter.get('/:taskId/details', validateToken, getTask);
taskRouter.get('/:pageNumber', validateToken, getTasks);


export default taskRouter;