import { AssessmentCategoryModel } from "@assessment/model/assessment.model.ts";
import { IAssessmentCategoryDocument } from "@assessment/model/assessment.model.ts/types";


export default async function fetchAssessmentCategoryDetails(categoryId:String) {
    const query = { _id: categoryId }
 
    return AssessmentCategoryModel.findOne(query)
    .then((foundCategory:IAssessmentCategoryDocument)=> {
        if(!foundCategory) return '';
        return foundCategory.name;
    })
    .catch((error)=> {
        console.log('QUERY ERROR: There was an error finding assessment category details => ', error);
        return '';
    })
}