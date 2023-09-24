import { getStaffUserByStaffId } from "src/api/shared/services/db/staff.service";
import { IStaffDocument } from "@staff/model/types";

interface IStaffProfileDocuments {
    id:string;
    docTitle: string;
    docType: string;
    docDate: string;
    docFileLink: string;
    docFileName: string;
    createdAt: Date
}

interface IFetchStaffProfileDocumentsResponse {
    documents:Array<IStaffProfileDocuments>;
    currentPage:number;
    totalPages:number;
}

export default function fetchAllStaffDocuments(staffId:number, pageNumber:number) {
    return new Promise<IFetchStaffProfileDocumentsResponse>((resolve, reject)=> {

        getStaffUserByStaffId(staffId)
        .then(async (foundStaff:IStaffDocument)=> {
            

            const documentsCount = foundStaff.documents.length;

            const queryPageNumber = pageNumber - 1 || 0;

            const resultsPerPage = 10;
            const resultOffset = (resultsPerPage) * queryPageNumber;
            const resultsLimit = resultsPerPage + resultOffset;
            const totalPages = Math.ceil(documentsCount / resultsPerPage);

            const documentsToReturn:Pick<IStaffDocument, 'documents'>['documents'] = foundStaff.documents.reverse().slice(resultOffset, resultsLimit)

            const documentsForClient:IStaffProfileDocuments[] = []

            for await ( const document of documentsToReturn ) {

                documentsForClient.push({
                    id: document._id.toString(),
                    docTitle: document.docTitle,
                    docType: document.docType,
                    docFileName: document.docFileName,
                    docDate: document.docDate,
                    docFileLink: document.docFileLink,
                    createdAt: document.createdAt
                })
            }

            resolve({ 
                currentPage: pageNumber,
                totalPages: totalPages,
                documents: documentsForClient
            })
        })
        .catch((error)=> reject(error))
    })
}