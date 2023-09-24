import staffShiftsModel from "@staff/model/staffshifts.model";
import formatStaffShift, { IFormatStaffShift } from "./formatStaffShift";

interface IFetchStaffShiftsResponse {
    currentPage:number;
    totalPages:number;
    shifts:IFormatStaffShift[]
}

export default function fetchStaffShifts(staffObjId:string, pageNumber:number) {
    return new Promise<IFetchStaffShiftsResponse>((resolve, reject)=> {

        const   parsedPageNumber = pageNumber - 1 ?? 0,
        resultsPerPage = 10, 
        pageOffset = resultsPerPage * parsedPageNumber;

        const query = { staffRef: staffObjId }

        staffShiftsModel.find(query)
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then(async (foundStaffShifts)=> {

            const formattedStaffShifts:IFormatStaffShift[] = [];
            
            for await (const staffShift of foundStaffShifts) {
                formattedStaffShifts.push(formatStaffShift(staffShift));
            }

            staffShiftsModel.count()
            .then((totalStaffCount:number)=> {
                const totalPageNumber = Math.ceil(totalStaffCount / resultsPerPage);
                resolve({
                    currentPage: pageNumber,
                    totalPages: totalPageNumber,
                    shifts: formattedStaffShifts
                })
            })
            .catch((error)=> {
                console.log("There was an error checking the count of staff shifts model", error);
                resolve({
                    currentPage: pageNumber,
                    totalPages: pageNumber,
                    shifts: formattedStaffShifts
                })
            })
        })
        .catch((error)=> reject(error))
    })
}