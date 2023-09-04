import { Request, Response } from "express"
import validateUploadStaffRequestBody, { INewDocument } from "./validateUploadStaffDocument"
import uploadFileToCloud from "@services/fileSystem/uploadFileToCloud"
import { sendFailureResponse, sendSuccessResponse } from "@globals/server/serverResponse"
import { ServerError } from "@globals/server/Error"
import addDocumentToStaff from "@staff/services/addDocumentToStaff"
import fetchAllStaffDocuments from "@staff/services/fetchAllStaffDocuments"

export default function uploadStaffDocument(req:Request, res:Response) {
    validateUploadStaffRequestBody({ staffId: req.params.staffId, ...req.body, staffDocFile: req.file})
    .then(({ requestBody })=> {
        uploadFileToCloud(requestBody.staffDocFile, 'individual-documents')
        .then((fileLink:string)=> {

            const newDocument:INewDocument = {
                docTitle: requestBody.docTitle,
                docType: requestBody.docType,
                docDate: requestBody.docDate,
                docFileLink: fileLink,
                docFileName: requestBody.docFileName
            }

            addDocumentToStaff(parseInt(requestBody.staffId), newDocument)
            .then(()=> {
                fetchAllStaffDocuments(parseInt(requestBody.staffId), 1)
                .then((response)=> {
                    return sendSuccessResponse({
                        res, 
                        statusCode: 200, 
                        message: "New staff document uploaded successfully", 
                        data: response
                    })
                })
                .catch((error)=> {
                    console.log("There was an error fetching updated staff documents list :", error);
                    const serverError = new ServerError()
                    return sendFailureResponse({ 
                        res, 
                        statusCode: serverError.statusCode, 
                        message: serverError.message
                    });
                })
            })
            .catch((error)=> {
                console.log("There was an error adding new staff document :", error);
                const serverError = new ServerError()
                return sendFailureResponse({ 
                    res, 
                    statusCode: serverError.statusCode, 
                    message: serverError.message
                });
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