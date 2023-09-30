import { IService } from "../models/types";
import formatFetchServiceResponse, { IFetchService } from "./formatFetchServiceResponse";

export default function formatFetchServiceListResponse(services:IService[]):IFetchService[] {
    return services.map(service => formatFetchServiceResponse(service))
}