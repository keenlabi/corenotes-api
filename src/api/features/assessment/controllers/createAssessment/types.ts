export interface validateCreateAssessmentType {
    status:boolean, 
    code:number, 
    message: 'SUCCESS'|string,
    requestBody: createAssessmentReqBodyType
}

export interface createAssessmentReqBodyType {
    title:string,
    category:string,
    questions:Array<{
        question:string,
        category:string
    }>,
    assignedTo:string;
    assignees: {
        assigneesType:'ALL'|'SPECIFIC',
        assigneesList:Array<string>
    },
}