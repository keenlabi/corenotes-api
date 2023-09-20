import { AssessmentQuestionsCategoryModel } from "src/api/features/assessment/model/assessment.model.ts";

export default async function fetchAssessmentQuestionCategoryDetails(categoryId:String) {
    return new Promise<string>((resolve)=> {
        const query = { _id: categoryId }

        AssessmentQuestionsCategoryModel.findOne(query)
        .then((foundCategory)=> {
            if (!foundCategory) resolve('');
            resolve(foundCategory.name.toString());
        })
        .catch((error)=> {
            console.log('QUERY ERROR: There was an error finding assessment category details => ', error);
            resolve('');
        })
    })
}