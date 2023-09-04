import { INewDocument } from "@individual/controllers/documents/uploadStaffDocument/validateUploadIndividualDocument";
import { individualModel } from "@individual/models/individual.model";


export default function addDocumentToIndividual(individualId:number, document:INewDocument) {
    return new Promise((resolve, reject)=> {
        const query = { individualId: individualId };
        const updateObj = { $push: { documents: document } };

        individualModel.findOneAndUpdate(query, updateObj, { new: true })
        .then((updatedStaff)=> resolve(updatedStaff))
        .catch((error)=> reject(error))
    })
}