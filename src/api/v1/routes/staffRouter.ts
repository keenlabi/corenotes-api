import { Router } from "express";
import fetchStaffs from "v1/controllers/staffs/fetchStaffs";

const staffRouter = Router();

staffRouter.get('/:pageNumber', fetchStaffs)

export default staffRouter;