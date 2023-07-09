import fetchAssessmentCategoryDetails from "@assessment/controllers/utils/fetchAssessmentCategoryDetails";
import { assessmentModel } from "@assessment/model/assessment.model.ts";

interface IAssessmentsResponse {
    currentPage:number; 
    totalPages:number;
    assessments:IMappedAssessment[];
}

interface IMappedAssessment {
    id:string;
    title:string;
    category:string;
    questionsCount:number;
    assginedTo:string;
}

export default function fetchAllAssessments(pageNumber:number) {
    return new Promise<IAssessmentsResponse>((resolve, reject)=> {

        const   queryPageNumber = pageNumber - 1 ?? 0,
                resultsPerPage = 10, 
                pageOffset = resultsPerPage * queryPageNumber,

            query = { };

        assessmentModel.find(query)
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then(async (foundAssessments)=> {

            const mappedAssessments:any[] = [];

            for await (const assessment of foundAssessments) {
                mappedAssessments.push({
                    id:assessment._id,
                    title: assessment.title,
                    category: await fetchAssessmentCategoryDetails(assessment.category),
                    questionsCount: assessment.questions.length,
                    assignedTo: `${assessment.assignees.assigneesType.toLowerCase()}  ${assessment.assignedTo.toLowerCase()}`
                });
            }

            assessmentModel.count(query)
            .then((totalAssessments)=> {
                const totalPageNumber = Math.ceil(totalAssessments / resultsPerPage);
                resolve({
                    currentPage: pageNumber, 
                    totalPages: totalPageNumber,
                    assessments: mappedAssessments
                })
            })
        })
        .catch((error)=> reject(error))
    })
}