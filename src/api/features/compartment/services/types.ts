export interface ICompartmentFormat {
    id:string;
    compartmentId:number;
    title:string;
    staffRoles:Array<string>;
    assignedIndividuals:Array<string>;
    meta: {
        bgColor:string;
        labelColor:string;
    };
    createdAt:string;
}

export interface ICompartmentsListType extends Omit<ICompartmentFormat, 'staffRoles'|'assignedIndividuals'> {

}