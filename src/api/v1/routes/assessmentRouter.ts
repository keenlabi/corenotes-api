import { Router } from "express";
import createAssessment from "../controllers/assessments/createAssessment/createAssessment";
import fetchAssessments from "../controllers/assessments/fetchAssessments";
import fetchAssessmentCategories from "../controllers/assessments/fetchAssessmentCategories";
import createQuestionCategory from "../controllers/assessments/createQuestionCategory";
import createAssessmentCategory from "../controllers/assessments/createAssessmentCategory";

const assessmentRouter = Router();

assessmentRouter.get('/:individualId/:pageNumber', fetchAssessments)
assessmentRouter.post('/', createAssessment)

assessmentRouter.get('/categories', fetchAssessmentCategories)
assessmentRouter.post('/assessment-categories', createAssessmentCategory)
assessmentRouter.post('/question-categories', createQuestionCategory)

export default assessmentRouter;