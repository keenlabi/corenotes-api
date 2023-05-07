import { Request, Response } from "express"
import validateUploadStaffRequestBody from "./validateUploadStaffDocument"
import { sendFailureResponse } from "api/v1/utils/serverUtils/response"
import uploadFileToCloud from "api/v1/utils/FilesUtils/uploadFileToCloud"
import { UserModel } from "api/v1/models"
import fetchStaffDocuments from "../fetchStaffDocuments"

export default function uploadStaffDocument(req:Request, res:Response) {
    validateUploadStaffRequestBody({ staffId: req.params.staffId, ...req.body, staffDocFile: req.file})
    .then(({ requestBody })=> {
        uploadFileToCloud(requestBody.staffDocFile, 'staff-documents')
        .then((fileLink:string)=> {
            UserModel.findOneAndUpdate(
                { _id: requestBody.staffId },
                {
                    $push: {
                        documents: {
                            docTitle: requestBody.docTitle,
                            docType: requestBody.docType,
                            docDate: requestBody.docDate,
                            docFileLink: fileLink,
                            docFileName: requestBody.docFileName
                        }
                    }
                },
                { new: true }
            )
            .lean()
            .then(()=> {
                return fetchStaffDocuments(req, res)
            })
        })
        .catch((error)=> {
            // TODO: return error if validation is failed
            console.log(`FILE UPLOAD ERROR: There was an error updating file to CDN server`)
            console.log(error)
            sendFailureResponse(res, error.code, error.message);
        })
    })
    .catch((error)=> {
        // TODO: return error if validation is failed
        console.log(`VALIDATION ERROR: There was an error validating register staff request body`)
        console.log(error)
        sendFailureResponse(res, error.code, error.message);
    })
}