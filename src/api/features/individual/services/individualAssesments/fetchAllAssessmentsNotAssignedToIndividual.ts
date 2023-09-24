import fetchAssessmentCategoryDetails from "@assessment/controllers/utils/fetchAssessmentCategoryDetails";
import { assessmentModel } from "src/api/features/assessment/model/assessment.model.ts";

interface IAssessmentsResponse {
    currentPage:number; 
    totalPages:number;
    assessments:IMappedAssessment[];
}

export interface IMappedAssessment {
    id:string;
    assessmentId:number;
    title:string;
    category:string;
    questionsCount:number;
    assignees:string;
}

export default function fetchAllAssessmentsNotAssignedToIndividual(individualId:string, pageNumber:number) {
    return new Promise<IAssessmentsResponse>((resolve, reject)=> {
        const   queryPageNumber = pageNumber - 1 ?? 0,
                resultsPerPage = 10, 
                pageOffset = resultsPerPage * queryPageNumber,

            query = { assignees: { $ne:  individualId } };

        assessmentModel.find(query)
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then(async (foundAssessments)=> {

            const mappedAssessments:IMappedAssessment[] = [];

            for await (const assessment of foundAssessments) {
                mappedAssessments.push({
                    id: assessment._id.toString(),
                    assessmentId: assessment.assessmentId,
                    title: assessment.title,
                    category: await fetchAssessmentCategoryDetails(assessment.category),
                    questionsCount: assessment.questions.length,
                    assignees: `${assessment.assignees?.length} individuals`
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
            .catch((error)=> {
                console.log("There was an error fetching all unassigned assessment")
                resolve({
                    currentPage: pageNumber, 
                    totalPages: pageNumber,
                    assessments: mappedAssessments
                })
            })
        })
        .catch((error)=> reject(error))
    })
}