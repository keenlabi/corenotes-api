import { IStaffRole } from "../../model/types";
import getStaffsCountByProviderRole from "./getStaffsCountByProviderRole";

export interface IStaffRoleForClient {
    id:string;
    title:string;
    staffCount:number;
}

export default function formatStaffRolesForClient(staffRoles:Array<IStaffRole>) {
    return new Promise<Array<IStaffRoleForClient>>(async (resolve, reject)=> {

        const staffRolesResponse:Array<IStaffRoleForClient> = []

        try {

            for await ( const role of staffRoles ) {

                const staffsCountRes = await getStaffsCountByProviderRole(role._id.toString());

                staffRolesResponse.push({
                    id: role._id.toString(),
                    title: role.title.toUpperCase(),
                    staffCount: staffsCountRes,
                })
            }

            resolve(staffRolesResponse)

        } catch (error) {
            reject(error)
        }
    })
}