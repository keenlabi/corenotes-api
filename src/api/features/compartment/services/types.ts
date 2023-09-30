export interface ICompartmentFormat {
    id:string;
    compartmentId:number;
    title:string;
    subCompartmentsCount:number;
    meta: {
        bgColor:string;
        labelColor:string;
    };
    createdAt:string;
}

export interface ICompartmentsListType extends Omit<ICompartmentFormat, 'staffRoles'|'assignedIndividuals'> {
    // servicesCount:number;
    // staffRolesCount:number;
    // assignedIndividualsCount:number;
}