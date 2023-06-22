import { Router } from "express";
import uploadFile from "../../../shared/globals/middlewares/uploadFile";
import registerIndividual from "../controllers/register/registerIndividual";
import fetchIndividuals from "../controllers/fetchIndividuals";
import fetchIndividualProfile from "../controllers/fetchIndividualProfile";
import fetchIndividualAssessmentSession from "../controllers/assessments/fetchIndividualAssessmentSession";
import saveIndividualAssessmentSession from "../controllers/assessments/saveIndividualAssessmentSession";
import completeIndividualAssessmentSession from "../controllers/assessments/completeIndividualAssessmentSession";

const individualRouter = Router();

individualRouter.get('/assessments/:assessmentId/session', fetchIndividualAssessmentSession)
individualRouter.patch('/assessments/:assessmentId/session', saveIndividualAssessmentSession)
individualRouter.post('/assessments/:assessmentId/session', completeIndividualAssessmentSession)

individualRouter.get('/:pageNumber', fetchIndividuals)
individualRouter.get('/profile/:id', fetchIndividualProfile)
individualRouter.post('/', uploadFile('single', 'profileImage'), registerIndividual)



export default individualRouter;