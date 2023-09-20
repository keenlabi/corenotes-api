import { NotFoundError, ServerError } from "@globals/server/Error";
import { getAssessmentByAssessmentId } from "@services/db/assessment.service";
import fetchAssessmentCategoryDetails from "@assessment/controllers/utils/fetchAssessmentCategoryDetails";
import fetchAssessmentQuestionCategoryDetails from "@assessment/controllers/utils/fetchAssessmentQuestionCategoryDetails";

interface IAssessmentDetails {
    id:string;
    assessmentId:number;
    title:string;
    category:string;
    questions:Array<{
        id:string;
        category:string;
        question:string;
    }>;
    assessmentType:string;
    assignees:string[];
}

export default function fetchAssessmentDetails(assessmentId:number) {
    return new Promise((resolve, reject)=> {
        getAssessmentByAssessmentId(assessmentId)
        .then(async (foundAssessment)=> {

            if(!foundAssessment) {
                const notFoundError = new NotFoundError("Assessment not found");
                reject(notFoundError);
            }

            const questionsWithCategories:Pick<IAssessmentDetails, 'questions'>['questions'] = [];

            for await ( const question of  foundAssessment?.questions!) {
                questionsWithCategories.push({
                    id: question?._id.toString()!,
                    category: (await fetchAssessmentQuestionCategoryDetails(question?.category!)).toString(),
                    question: question?.question!
                })
            }
            
            const assessmentDetails:IAssessmentDetails = {
                id: foundAssessment!._id.toString()!,
                assessmentId: foundAssessment!.assessmentId!,
                title: foundAssessment!.title!,
                category: (await fetchAssessmentCategoryDetails(foundAssessment!.category!)).toString() + ' assessment',
                questions: questionsWithCategories,
                assessmentType: foundAssessment!.assessmentType.toLowerCase()!,
                assignees: foundAssessment!.assignees
            }

            resolve(assessmentDetails);
        })
        .catch((error)=> {
            console.log("There was an error fetch assessment details: ", error)

            const serverError = new ServerError();
            reject(serverError);
        })
    })
}