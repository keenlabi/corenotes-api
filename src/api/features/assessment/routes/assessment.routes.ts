import { Router } from "express";
import createAssessment from "../controllers/createAssessment/createAssessment";
import fetchAssessments from "../controllers/fetchAssessments";
import fetchAssessmentCategories from "../controllers/fetchAssessmentCategories";
import createQuestionCategory from "../controllers/createQuestionCategory";
import createAssessmentCategory from "../controllers/createAssessmentCategory";

const assessmentRouter = Router();

assessmentRouter.get('/:individualId/:pageNumber', fetchAssessments)
assessmentRouter.post('/', createAssessment)

assessmentRouter.get('/categories', fetchAssessmentCategories)
assessmentRouter.post('/assessment-categories', createAssessmentCategory)
assessmentRouter.post('/question-categories', createQuestionCategory)

export default assessmentRouter;