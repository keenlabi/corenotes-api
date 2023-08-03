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
import postMedicationToIndividual from "@individual/controllers/medications/postMedicationToIndividual";
import getIndividualMedications from "@individual/controllers/medications/getIndividualMedications";
import addGoalTrackingService from "@individual/controllers/services/addGoalTrakingService";
import fetchIndividualGoalsTrackingServices from "@individual/controllers/services/fetchIndividualGoalsTrackingServices";
import getIndividualMedicationSupervisoryReview from "@individual/controllers/medications/getIndividualMedicationSupervisoryReviews";
import patchIndividualMedicationSupervisoryReview from "@individual/controllers/medications/patchIndividualMedicationSupervisoryReview";
import patchDiscontinueMedication from "@individual/controllers/medications/patchDiscontinueMedication";
import postPRNMedicationToIndividual from "@individual/controllers/medications/postPRNMedicationToIndividual";

const individualRouter = Router();

individualRouter.post('/:individualId/medications/prn-medication', validateToken, postPRNMedicationToIndividual)
individualRouter.get('/:individualId/medications/:medicationId/supervisory-medication-review/:pageNumber', validateToken, getIndividualMedicationSupervisoryReview)
individualRouter.patch('/:individualId/medications/supervisory-medication-review', validateToken, patchIndividualMedicationSupervisoryReview)
individualRouter.patch('/:individualId/medications/toggle', validateToken, patchDiscontinueMedication)
individualRouter.post('/:individualId/medications', validateToken, postMedicationToIndividual)
individualRouter.get('/:individualId/medications/:pageNumber', validateToken, getIndividualMedications)

individualRouter.get('/assessments/:assessmentId/session', validateToken, fetchIndividualAssessmentSession)
individualRouter.patch('/assessments/:assessmentId/session', validateToken, saveIndividualAssessmentSession)
individualRouter.post('/assessments/:assessmentId/session', validateToken, completeIndividualAssessmentSession)

individualRouter.get('/:individualId/services/goal-tracking/:pageNumber', validateToken, fetchIndividualGoalsTrackingServices)
individualRouter.post('/:individualId/services/goal-tracking', validateToken, addGoalTrackingService)
individualRouter.get('/:individualId/services', validateToken, fetchIndividualServices)
individualRouter.post('/:individualId/services', validateToken, assignIndividualServices)

individualRouter.get('/profile/:individualId', fetchIndividualProfile)
individualRouter.get('/:pageNumber', fetchIndividuals)

individualRouter.post('/', uploadFile('single', 'profileImage'), registerIndividual)


export default individualRouter;