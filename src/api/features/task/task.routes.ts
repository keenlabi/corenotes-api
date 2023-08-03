import validateToken from "@globals/middlewares/validateToken";
import { Router } from "express";
import getTasks from "./controllers/getTasks";
import getTask from "./controllers/getTask";
import administerMedicationTask from "./controllers/administerMedicationTask";
import findMedicationTaskByBarcode from "./controllers/findMedicationTaskByBarcode";
import uploadFile from "@globals/middlewares/uploadFile";
import administerUncontrolledMedicationTask from "./controllers/administerUncontrolledMedicationTask";

const taskRouter = Router();

taskRouter.get('/medications/search-by-barcode/:barcode', validateToken, findMedicationTaskByBarcode);

taskRouter.patch('/:taskId/administer', validateToken, administerMedicationTask);
taskRouter.patch('/:taskId/administer-uncontrolled', uploadFile('single', 'topicalPhoto'), validateToken, administerUncontrolledMedicationTask);

taskRouter.get('/:taskId/details', validateToken, getTask);
taskRouter.get('/:pageNumber', validateToken, getTasks);


export default taskRouter;