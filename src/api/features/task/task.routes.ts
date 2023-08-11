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
import declineDailyLivingActivityTask from "./controllers/daily-living-activity/declineDailyLivingActivityTask";
import completeDailyLivingActivityTask from "./controllers/daily-living-activity/completeDailyLivingActivityTask";
import declineShiftNotesTask from "./controllers/shift-notes/declineShiftNotesTask";
import completeShiftNotesTask from "./controllers/shift-notes/completeShiftNotesTask";
import completeBloodGlucoseCheckTask from "./controllers/blood-glucose-check/completeBloodGlucoseCheckTask";
import declineBloodGlucoseCheckTask from "./controllers/blood-glucose-check/declineBloodGlucoseCheckTask";

const taskRouter = Router();

taskRouter.post('/:taskId/decline-blood-glucose-check', validateToken, declineBloodGlucoseCheckTask)
taskRouter.post('/:taskId/complete-blood-glucose-check', validateToken, completeBloodGlucoseCheckTask)

taskRouter.post('/:taskId/decline-shift-notes', validateToken, declineShiftNotesTask)
taskRouter.post('/:taskId/complete-shift-notes', validateToken, completeShiftNotesTask)

taskRouter.post('/:taskId/decline-daily-living-activity', validateToken, declineDailyLivingActivityTask)
taskRouter.post('/:taskId/complete-daily-living-activity', validateToken, completeDailyLivingActivityTask)

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