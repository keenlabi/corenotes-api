import { Router } from "express";
import fetchStaffProfile from "v1/controllers/staffs/fetchStaffProfile";
import fetchStaffs from "v1/controllers/staffs/fetchStaffs";

const staffRouter = Router();

staffRouter.get('/profile/:staffId', fetchStaffProfile)
staffRouter.get('/:pageNumber', fetchStaffs)

export default staffRouter;