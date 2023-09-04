import { Router } from "express";
import createAssessment from "../controllers/createAssessment/createAssessment";
import fetchAssessments from "../controllers/fetchAssessments";
import fetchAssessmentCategories from "../controllers/fetchAssessmentCategories";
import createQuestionCategory from "../controllers/createQuestionCategory";
import createAssessmentCategory from "../controllers/createAssessmentCategory";
import fetchAssessmentDetails from "@assessment/controllers/fetchAssessment";

const assessmentRouter = Router();

assessmentRouter.get('/categories', fetchAssessmentCategories)
assessmentRouter.post('/assessment-categories', createAssessmentCategory)
assessmentRouter.post('/question-categories', createQuestionCategory)

assessmentRouter.get('/details/:assessmentId', fetchAssessmentDetails)
// assessmentRouter.get('/:individualId/:pageNumber', fetchIndividualAssessments)
assessmentRouter.get('/:pageNumber', fetchAssessments)
assessmentRouter.post('/', createAssessment)

export default assessmentRouter;