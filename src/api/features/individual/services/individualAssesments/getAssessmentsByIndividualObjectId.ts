import { assessmentModel } from "src/api/features/assessment/model/assessment.model.ts"
import { NotFoundError, ServerError } from "@globals/server/Error";
import { getIndividualByIndividualId } from "@services/db/individual.service";
import getAssessmentCategoryByObjectId from "./getAssessmentCategoryByObjectId";

interface IIndividualAssessmentResponse {
    currentPage:number;
    totalPages:number;
    list:IMappedAssessment[]
}

interface IMappedAssessment {
    id:string;
    assessmentId:number;
    title:string;
    category:string;
    questionCount:number;
}

export default function getAssessmentsByIndividualId(individualId:number, pageNumber:number) {
    return new Promise<IIndividualAssessmentResponse>((resolve, reject)=> {

        getIndividualByIndividualId(individualId)
        .then((foundIndividual)=> {

            if(!foundIndividual) {
                const notFoundError = new NotFoundError("Individual has not been assigned any assessments");
                reject(notFoundError);
            }
            
            const query = { 
                $or: [
                    { "assignees.assigneesList": foundIndividual?._id.toString() },
                    { "assignees.assigneesType": "ALL"}
                ]
            };

            const queryPageNumber = pageNumber - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * queryPageNumber;

            assessmentModel.find(query)
            .skip(pageOffset)
            .limit(resultsPerPage)
            .sort({ createdAt: -1 })
            .then(async (foundAssessments)=> {
                
                const mappedAssessments:IMappedAssessment[] = []

                for await ( const assessment of foundAssessments ) {
                    await getAssessmentCategoryByObjectId(assessment.category)
                    .then((foundAssessmentCategory)=> {
                        if(foundAssessmentCategory) {
                            mappedAssessments.push({
                                id: assessment._id.toString(),
                                assessmentId: assessment.assessmentId,
                                title: assessment.title,
                                category: foundAssessmentCategory.name,
                                questionCount: assessment.questions.length
                            })
                        }
                    })
                    .catch((error)=> {
                        console.log("There was a server error", error)
                        const serverError = new ServerError();
                        reject(serverError);
                    })
                }

                assessmentModel.count(query)
                .then((totalIndividualCount:number)=> {
                
                    const totalPageNumber = Math.ceil(totalIndividualCount / resultsPerPage);

                    resolve({
                        currentPage: pageNumber,
                        totalPages: totalPageNumber,
                        list: mappedAssessments
                    })
                })
            })
            .catch((error)=> {
                console.log("There was an error retrieving assessments by individual object Id", error);
                reject(error);
            })
        })
        .catch((error)=> {
            console.log("There was an error finding individual assessments by individual object Id", error);
            reject(error);
        })
    })
}