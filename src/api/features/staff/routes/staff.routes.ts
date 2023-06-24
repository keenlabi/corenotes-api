import { Router } from "express";
import fetchStaffProfile from "../controllers/fetchStaffProfile";
import fetchStaffDocuments from "../controllers/documents/fetchStaffDocuments";
import uploadStaffDocument from "../controllers/documents/uploadStaffDocument/uploadStaffDocument";
import resetStaffPassword from "../controllers/security/resetStaffPassword";
import validateToken from "../../../shared/globals/middlewares/validateToken";
import uploadFile from "../../../shared/globals/middlewares/uploadFile";
import fetchStaffs from "../controllers/fetchStaffs";
import deactivateStaff from "../controllers/security/deactivateStaff";
import activateStaff from "../controllers/security/activateStaff";
import fetchStaffActivities from "../controllers/activities/fetchStaffActivities";
import register from "../controllers/register/register";

const staffRouter = Router();

staffRouter.post('/register', uploadFile('single', 'profileImage'), register)
staffRouter.get('/profile/:staffId', fetchStaffProfile)
staffRouter.get('/:staffId/documents/:pageNumber', fetchStaffDocuments)
staffRouter.post('/:staffId/documents', uploadFile('single', 'staffDocFile'), uploadStaffDocument)

staffRouter.post('/:staffId/password-reset', resetStaffPassword)
staffRouter.post('/:staffId/deactivate', validateToken, deactivateStaff)
staffRouter.post('/:staffId/activate', validateToken, activateStaff)

staffRouter.get('/:pageNumber', fetchStaffs)

staffRouter.post('/:staffId/activities/:pageNumber', fetchStaffActivities)
export default staffRouter;