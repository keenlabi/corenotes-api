import createService from "./createService";
import fetchServices from "./fetchServices";
import fetchServiceDetails from "./fetchServiceDetails";
import fetchProvidedServices from "./fetchProvidedServices";
import fetchServiceIndividuals from "./fetchServiceIndividuals";
import fetchServicesByCategory from "./fetchServicesByCategory";
import fetchServiceMedications from "./fetchServiceMedications"

export default { 
    createService, 
    fetchServices, 
    fetchServicesByCategory,
    fetchServiceDetails, 
    fetchProvidedServices,
    fetchServiceIndividuals,
    fetchServiceMedications
}