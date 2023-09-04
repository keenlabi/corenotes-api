import { AssessmentCategoryModel } from "@assessment/model/assessment.model.ts"
import { IAssessmentCategoryDocument } from "@assessment/model/assessment.model.ts/types";
import { NotFoundError } from "@globals/server/Error";

export default function getAssessmentCategoryByObjectId(assessmentCategoryObjectId:string) {
    return new Promise<IAssessmentCategoryDocument|null>((resolve, reject)=> {
        
        const query = { _id: assessmentCategoryObjectId };

        AssessmentCategoryModel.findOne(query)
        .then((foundAssessmentCategory)=> {
            if(!foundAssessmentCategory) {
                const notFoundError = new NotFoundError("Assessment category not found");
                reject(notFoundError);
            }

            resolve(foundAssessmentCategory);
        })
        .catch((error)=> reject(error))
    })
}