import { Router } from "express";
import registerStaff from "v1/controllers/staffs/registerStaff/registerStaff";
import fetchStaffProfile from "v1/controllers/staffs/fetchStaffProfile";
import fetchStaffs from "v1/controllers/staffs/fetchStaffs";
import uploadFile from "v1/middlewares/uploadFile";
import uploadStaffDocument from "v1/controllers/staffs/documents/uploadStaffDocument/uploadStaffDocument";
import fetchStaffDocuments from "v1/controllers/staffs/documents/fetchStaffDocuments";

const staffRouter = Router();

staffRouter.post('/register', uploadFile('single', 'profileImage'), registerStaff)
staffRouter.get('/profile/:staffId', fetchStaffProfile)
staffRouter.get('/:staffId/documents/:pageNumber', fetchStaffDocuments)
staffRouter.post('/:staffId/documents', uploadFile('single', 'staffDocFile'), uploadStaffDocument)
staffRouter.get('/:pageNumber', fetchStaffs)

export default staffRouter;