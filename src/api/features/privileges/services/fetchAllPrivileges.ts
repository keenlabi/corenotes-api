import privilegeModel from "../model/privilege.model";
import { IPrivilegeDocument } from "../model/types";

export interface IFetchPrivilegeList {
    currentPage:number;
    totalPages:number;
    privileges:Array<IPrivilege>;
}

export interface IPrivilege {
    id:string;
    privilegeId:number;
    title:string;
}

export default function fetchAllPrivileges(pageNumber:number) {
    return new Promise<IFetchPrivilegeList>((resolve, reject)=> {
        
        const   queryPageNumber = pageNumber - 1 ?? 0,
        resultsPerPage = 10, 
        pageOffset = resultsPerPage * queryPageNumber;

        privilegeModel.find()
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then(async (foundPrivileges:IPrivilegeDocument[])=> {

            const mappedPrivilege:Array<IPrivilege>  = [];

            for await ( const privilege of foundPrivileges ) {
                mappedPrivilege.push({
                    id: privilege._id.toString(),
                    privilegeId: privilege.privilegeId,
                    title: privilege.title
                })
            }

            privilegeModel.count()
            .then((totalPrivilegeCount:number)=> {
                
                const totalPageNumber = Math.ceil(totalPrivilegeCount / resultsPerPage);

                resolve({
                    currentPage: pageNumber, 
                    totalPages: totalPageNumber,
                    privileges: mappedPrivilege
                })
            })

        })
        .catch((error)=> {
            console.log(error)
            reject(error)
        })

    })
}