import { getStaffRoleById } from "@services/db/staff.service";
import getUserByObjectId from "@services/db/user.service";
import staffModel from "@staff/model/staff.model";
import { IStaffDocument } from "@staff/model/types";
import { IUserDocument } from "@user/models/types";

interface IFetchStaffResponse {
    currentPage:number, 
    totalPages:number,
    staffs:staffList[]
}

interface staffList {
    id:string;
    staffId:number;
    profileImage:string; 
    firstname:string; 
    lastname:string; 
    dob:string; 
    role:string;
    gender:string; 
    phoneNumber:string;
    lastSeen:Date;
}


export default function fetchAllStaffs(pageNumber:number) {
    return new Promise<IFetchStaffResponse>(async (resolve, reject)=> {
        const   queryPageNumber = pageNumber - 1 ?? 0,
        resultsPerPage = 10, 
        pageOffset = resultsPerPage * queryPageNumber;

        const query = { active: true };

        staffModel.find(query)
        .skip(pageOffset)
        .limit(resultsPerPage)
        .sort({ createdAt: -1 })
        .then(async (foundStaffs:IStaffDocument[])=> {    

            const mappedStaffs:Array<staffList>  = [];

            for await ( const staff of foundStaffs ) {
                mappedStaffs.push({
                    id: staff._id.toString(),
                    staffId: staff.staffId,
                    profileImage: staff.profileImage,
                    firstname: staff.firstname,
                    lastname: staff.lastname,
                    dob: staff.dob,
                    role: (await getStaffRoleById(staff.providerRole)).title,
                    phoneNumber: staff.phoneNumber.work,
                    gender: staff.gender,
                    lastSeen: staff.lastSeen
                })
            }

            staffModel.count()
            .then((totalStaffCount:number)=> {
                
                const totalPageNumber = Math.ceil(totalStaffCount / resultsPerPage);

                resolve({
                    currentPage: pageNumber, 
                    totalPages: totalPageNumber,
                    staffs: mappedStaffs
                })
            })
        })
        .catch((error)=> {
            console.log(error)
            reject(error)
        })
    });
}