import { Request, Response } from "express"
import validateUploadStaffRequestBody from "./validateUploadStaffDocument"
import fetchStaffDocuments from "../fetchStaffDocuments"
import uploadFileToCloud from "@services/fileSystem/uploadFileToCloud"
import { sendFailureResponse } from "@globals/server/serverResponse"
import UserModel from "@user/models/user.model"

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
            sendFailureResponse({res, statusCode: error.code, message: error.message});
        })
    })
    .catch((error)=> {
        // TODO: return error if validation is failed
        console.log(`VALIDATION ERROR: There was an error validating register staff request body`)
        console.log(error)
        sendFailureResponse({res, statusCode: error.code, message: error.message});
    })
}