import { Router } from "express";
import uploadFile from "../middlewares/uploadFile";
import registerStaff from "../controllers/staffs/registerStaff/registerStaff";
import fetchStaffProfile from "../controllers/staffs/fetchStaffProfile";
import fetchStaffDocuments from "../controllers/staffs/documents/fetchStaffDocuments";
import uploadStaffDocument from "../controllers/staffs/documents/uploadStaffDocument/uploadStaffDocument";
import resetStaffPassword from "../controllers/staffs/security/resetStaffPassword";
import validateToken from "../middlewares/auth/validateToken";
import fetchStaffs from "../controllers/staffs/fetchStaffs";
import deactivateStaff from "../controllers/staffs/security/deactivateStaff";
import activateStaff from "../controllers/staffs/security/activateStaff";
import fetchStaffActivities from "../controllers/staffs/activities/fetchStaffActivities";

const staffRouter = Router();

staffRouter.post('/register', uploadFile('single', 'profileImage'), registerStaff)
staffRouter.get('/profile/:staffId', fetchStaffProfile)
staffRouter.get('/:staffId/documents/:pageNumber', fetchStaffDocuments)
staffRouter.post('/:staffId/documents', uploadFile('single', 'staffDocFile'), uploadStaffDocument)

staffRouter.post('/:staffId/password-reset', resetStaffPassword)
staffRouter.post('/:staffId/deactivate', validateToken, deactivateStaff)
staffRouter.post('/:staffId/activate', validateToken, activateStaff)

staffRouter.get('/:pageNumber', fetchStaffs)

staffRouter.post('/:staffId/activities/:pageNumber', fetchStaffActivities)
export default staffRouter;