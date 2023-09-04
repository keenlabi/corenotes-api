import { Router } from "express";
import uploadFile from "../../../shared/globals/middlewares/uploadFile";
import registerIndividual from "../controllers/register/registerIndividual";
import fetchIndividuals from "../controllers/fetchIndividuals";
import fetchIndividualProfile from "../controllers/profile/fetchIndividualProfile";
import fetchIndividualAssessmentSession from "../controllers/assessments/fetchIndividualAssessmentSession";
import saveIndividualAssessmentSession from "../controllers/assessments/saveIndividualAssessmentSession";
import completeIndividualAssessmentSession from "../controllers/assessments/completeIndividualAssessmentSession";
import validateToken from "@globals/middlewares/validateToken";
import fetchIndividualServices from "../controllers/services/fetchIndividualServices";
import assignIndividualServices from "../controllers/services/assignIndividualServices";
import postMedicationToIndividual from "@individual/controllers/medications/postMedicationToIndividual";
import getIndividualMedications from "@individual/controllers/medications/getIndividualMedications";
import addGoalTrackingService from "@individual/controllers/services/goal-tracking/addGoalTrakingService";
import fetchIndividualGoalsTrackingServices from "@individual/controllers/services/goal-tracking/fetchIndividualGoalsTrackingServices";
import getIndividualMedicationSupervisoryReview from "@individual/controllers/medications/getIndividualMedicationSupervisoryReviews";
import patchIndividualMedicationSupervisoryReview from "@individual/controllers/medications/patchIndividualMedicationSupervisoryReview";
import patchDiscontinueMedication from "@individual/controllers/medications/patchDiscontinueMedication";
import postPRNMedicationToIndividual from "@individual/controllers/medications/postPRNMedicationToIndividual";
import addDailyLivingActivityService from "@individual/controllers/services/daily-living-activity/addDailyLivingActivityService";
import fetchIndividualDailyLivingActivityServices from "@individual/controllers/services/daily-living-activity/fetchIndividualDailyLivingActivityServices";
import fetchIndividualAssessments from "@individual/controllers/assessments/fetchIndividualAssessments";
import addBehaviorService from "@individual/controllers/services/behavior-management/addBehaviorService";
import fetchIndividualBehaviorManagementServices from "@individual/controllers/services/behavior-management/fetchIndividualBehaviorManagementServices";
import addChoreService from "@individual/controllers/services/chores/addChoreService";
import fetchIndividualChoreServices from "@individual/controllers/services/chores/fetchIndividualChoreServices";
import fetchIndividualDocuments from "@individual/controllers/documents/fetchIndividualDocuments";
import uploadIndividualDocument from "@individual/controllers/documents/uploadStaffDocument/uploadIndividualDocument";

const individualRouter = Router();

individualRouter.get('/:individualId/documents/:pageNumber', validateToken, fetchIndividualDocuments)
individualRouter.post('/:individualId/documents', validateToken, uploadFile('single', 'individualDocFile'), uploadIndividualDocument)

individualRouter.post('/:individualId/medications/prn-medication', validateToken, postPRNMedicationToIndividual)
individualRouter.get('/:individualId/medications/:medicationId/supervisory-medication-review/:pageNumber', validateToken, getIndividualMedicationSupervisoryReview)
individualRouter.patch('/:individualId/medications/supervisory-medication-review', validateToken, patchIndividualMedicationSupervisoryReview)
individualRouter.patch('/:individualId/medications/toggle', validateToken, patchDiscontinueMedication)
individualRouter.post('/:individualId/medications', validateToken, postMedicationToIndividual)
individualRouter.get('/:individualId/medications/:pageNumber', validateToken, getIndividualMedications)

individualRouter.get('/:individualId/assessments/:pageNumber', validateToken, fetchIndividualAssessments)
individualRouter.get('/:individualId/assessments/:assessmentId/session', validateToken, fetchIndividualAssessmentSession)
individualRouter.post('/:individualId/assessments/:assessmentId/session', validateToken, completeIndividualAssessmentSession)
individualRouter.patch('/assessments/:assessmentId/session', validateToken, saveIndividualAssessmentSession)

individualRouter.get('/:individualId/services/chore/:pageNumber', validateToken, fetchIndividualChoreServices)
individualRouter.post('/:individualId/services/chore', validateToken, addChoreService)
individualRouter.get('/:individualId/services/behavior-management/:pageNumber', validateToken, fetchIndividualBehaviorManagementServices)
individualRouter.post('/:individualId/services/behavior-management', validateToken, addBehaviorService)
individualRouter.get('/:individualId/services/daily-living-activity/:pageNumber', validateToken, fetchIndividualDailyLivingActivityServices)
individualRouter.post('/:individualId/services/daily-living-activity', validateToken, addDailyLivingActivityService)
individualRouter.get('/:individualId/services/goal-tracking/:pageNumber', validateToken, fetchIndividualGoalsTrackingServices)
individualRouter.post('/:individualId/services/goal-tracking', validateToken, addGoalTrackingService)
individualRouter.get('/:individualId/services', validateToken, fetchIndividualServices)
individualRouter.post('/:individualId/services', validateToken, assignIndividualServices)

individualRouter.get('/profile/:individualId', fetchIndividualProfile)
individualRouter.get('/:pageNumber', fetchIndividuals)

individualRouter.post('/', uploadFile('single', 'profileImage'), registerIndividual)


export default individualRouter;