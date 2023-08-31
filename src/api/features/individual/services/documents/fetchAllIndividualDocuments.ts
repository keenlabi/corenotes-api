import { NotFoundError } from "@globals/server/Error";
import { IIndividualDocument } from "@individual/models/types";
import { getIndividualByIndividualId } from "@services/db/individual.service";

interface IIndividualProfileDocuments {
    id:string;
    docTitle: string;
    docType: string;
    docDate: string;
    docFileLink: string;
    docFileName: string;
    createdAt: Date
}

interface IFetchIndividualProfileDocumentsResponse {
    list:Array<IIndividualProfileDocuments>;
    currentPage:number;
    totalPages:number;
}

export default function fetchAllIndividualDocuments(staffId:number, pageNumber:number) {
    return new Promise<IFetchIndividualProfileDocumentsResponse>((resolve, reject)=> {

        getIndividualByIndividualId(staffId)
        .then(async (foundIndividual)=> {
            if(!foundIndividual) {
                const notFound =  new NotFoundError("Individual not found")
                reject(notFound);
            }

            const documentsCount = foundIndividual!.documents.length;

            const queryPageNumber = pageNumber - 1 || 0;

            const resultsPerPage = 10;
            const resultOffset = (resultsPerPage) * queryPageNumber;
            const resultsLimit = resultsPerPage + resultOffset;
            const totalPages = Math.ceil(documentsCount / resultsPerPage);

            const documentsToReturn:Pick<IIndividualDocument, 'documents'>['documents'] = foundIndividual!.documents.reverse().slice(resultOffset, resultsLimit)

            const documentsForClient:IIndividualProfileDocuments[] = []

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
                list: documentsForClient
            })
        })
        .catch((error)=> reject(error))
    })
}