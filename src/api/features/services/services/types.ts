export interface ICreateServiceRequestBody {
    id:string,
    serviceId:number,
    title:string,
    compartments:Array<string>,
    staffRoles:Array<string>
    assignedIndividuals:Array<string>
}

export interface IServiceListItem {
    id:string;
    serviceId:number;
    title:string;
    compartments:Array<string>;
    staffRolesCount:number;
    assignedIndividualsCount:number;
    createdAt:Date;
}

export interface IServicesResponseFormat {
    services: IServiceListItem[];
    currentPage:number;
    totalPages:number;
}