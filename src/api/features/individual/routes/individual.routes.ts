import { Router } from "express";
import uploadFile from "../../../shared/globals/middlewares/uploadFile";
import registerIndividual from "../controllers/register/registerIndividual";
import fetchIndividuals from "../controllers/fetchIndividuals";
import fetchIndividualProfile from "../controllers/fetchIndividualProfile";
import fetchIndividualAssessmentSession from "../controllers/assessments/fetchIndividualAssessmentSession";
import saveIndividualAssessmentSession from "../controllers/assessments/saveIndividualAssessmentSession";
import completeIndividualAssessmentSession from "../controllers/assessments/completeIndividualAssessmentSession";
import validateToken from "@globals/middlewares/validateToken";
import fetchIndividualServices from "../controllers/fetchIndividualServices";
import assignIndividualServices from "../controllers/assignIndividualServices";

const individualRouter = Router();

individualRouter.get('/assessments/:assessmentId/session', validateToken, fetchIndividualAssessmentSession)
individualRouter.patch('/assessments/:assessmentId/session', validateToken, saveIndividualAssessmentSession)
individualRouter.post('/assessments/:assessmentId/session', validateToken, completeIndividualAssessmentSession)

individualRouter.get('/:individualId/services', validateToken, fetchIndividualServices)
individualRouter.post('/:individualId/services', validateToken, assignIndividualServices)

individualRouter.get('/profile/:id', fetchIndividualProfile)
individualRouter.get('/:pageNumber', fetchIndividuals)

individualRouter.post('/', uploadFile('single', 'profileImage'), registerIndividual)


export default individualRouter;