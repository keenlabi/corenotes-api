export interface UploadIndividualRequestBodyType {
    individualId:number;
    docTitle:string,
    docType:string,
    docDate:string,
    staffDocFile:Express.Multer.File,
    staffId:string,
    docFileName:string
}

export interface ValidateUploadIndividualRequestBodyType {
    status:boolean, 
    code:number, 
    message: 'SUCCESS'|string,
    requestBody: UploadIndividualRequestBodyType
}

export interface INewDocument {
    docTitle:string;
    docType:string;
    docDate:string;
    docFileLink:string;
    docFileName:string;
}

export default function validateUploadIndividualRequestBody(data:UploadIndividualRequestBodyType) {
    return new Promise<ValidateUploadIndividualRequestBodyType>((resolve, reject)=> {
        // check if any field is empty and return error if true
        if(Object.keys(data).length === 0) reject({ status: false, code: 422, message:'Input field cannot be empty' })

        if(!data.individualId) reject({ status: false, code: 422,  message:'Individual id parameter cannot be empty' });
        if(!data.docTitle) reject({ status: false, code: 422,  message:'Document title field cannot be empty' });
        if(!data.docType) reject({ status: false, code: 422,  message:'Document type field cannot be empty' });
        if(!data.docDate) reject({ status: false, code: 422,  message:'Document date field cannot be empty' });
        if(!data.staffDocFile) reject({ status: false, code: 422,  message:'Document file field cannot be empty' });
        if(!data.docFileName) reject({ status: false, code: 422,  message:'Document name parameter cannot be empty' });
        
        // return success if true
        resolve({ status:true, code:200, message: 'SUCCESS', requestBody: data });
    })
}