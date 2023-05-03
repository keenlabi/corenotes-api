import { Router } from "express";
import registerStaff from "v1/controllers/staffs/registerStaff/registerStaff";
import fetchStaffProfile from "v1/controllers/staffs/fetchStaffProfile";
import fetchStaffs from "v1/controllers/staffs/fetchStaffs";
import uploadFile from "v1/middlewares/uploadFile";

const staffRouter = Router();

staffRouter.post('/register', uploadFile('single', 'profileImage'), registerStaff)
staffRouter.get('/profile/:staffId', fetchStaffProfile)
staffRouter.get('/:pageNumber', fetchStaffs)

export default staffRouter;