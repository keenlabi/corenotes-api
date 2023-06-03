import { AssessmentCategoryModel } from "../../../models/AssessmentModel";
import { IAssessmentCategory } from "../../../models/AssessmentModel/types";

export default async function fetchAssessmentCategoryDetails(categoryId:String) {
    const query = { _id: categoryId }
 
    return AssessmentCategoryModel.findOne(query)
    .then((foundCategory:IAssessmentCategory)=> {
        if(!foundCategory) return '';
        return foundCategory.name;
    })
    .catch((error)=> {
        console.log('QUERY ERROR: There was an error finding assessment category details => ', error);
        return '';
    })
}