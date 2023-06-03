import { AssessmentQuestionsCategoryModel } from "../../../models/AssessmentModel";
import { IAssessmentQuestionCategory } from "../../../models/AssessmentModel/types";


export default async function fetchAssessmentQuestionCategoryDetails(categoryId:String):Promise<String> {
    
    const query = { _id: categoryId }

    return AssessmentQuestionsCategoryModel.findOne(query)
    .then((foundCategory:IAssessmentQuestionCategory)=> {
        if(!foundCategory) return '';
        return foundCategory.name;
    })
    .catch((error)=> {
        console.log('QUERY ERROR: There was an error finding assessment category details => ', error);
        return '';
    })
}