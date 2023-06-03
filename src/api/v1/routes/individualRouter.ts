import { Router } from "express";
import uploadFile from "../middlewares/uploadFile";
import registerIndividual from "../controllers/individuals/register/registerIndividual";
import fetchIndividuals from "../controllers/individuals/fetchIndividuals";
import fetchIndividualProfile from "../controllers/individuals/fetchIndividualProfile";
import fetchIndividualAssessmentSession from "../controllers/individuals/assessments/fetchIndividualAssessmentSession";
import saveIndividualAssessmentSession from "../controllers/individuals/assessments/saveIndividualAssessmentSession";
import completeIndividualAssessmentSession from "../controllers/individuals/assessments/completeIndividualAssessmentSession";

const individualRouter = Router();

individualRouter.get('/assessments/:assessmentId/session', fetchIndividualAssessmentSession)
individualRouter.patch('/assessments/:assessmentId/session', saveIndividualAssessmentSession)
individualRouter.post('/assessments/:assessmentId/session', completeIndividualAssessmentSession)

individualRouter.get('/:pageNumber', fetchIndividuals)
individualRouter.get('/profile/:id', fetchIndividualProfile)
individualRouter.post('/', uploadFile('single', 'profileImage'), registerIndividual)



export default individualRouter;