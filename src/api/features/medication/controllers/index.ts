import createMedication from "./createMedication";
import fetchMedications from "./fetchMedications";
import fetchMedicationDetails from "./fetchMedicationDetails";
import postMedicationToService from "./postMedicationToService";
import fetchMedicationIndividuals from "./fetchMedicationIndividuals"

export const medicationControllers = { 
    createMedication, 
    fetchMedications, 
    fetchMedicationDetails, 
    postMedicationToService,
    fetchMedicationIndividuals
}