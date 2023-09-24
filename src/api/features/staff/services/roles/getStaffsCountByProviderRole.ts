import { sendSuccessResponse } from "@globals/server/serverResponse"
import staffModel from "@staff/model/staff.model"

export default function getStaffsCountByProviderRole(staffRoleObjectId:string) {
    return new Promise<number>((resolve, reject)=> {

        const query = { providerRole: staffRoleObjectId }

        staffModel.count(query)
        .then((foundStaffCount)=> resolve(foundStaffCount))
        .catch((error)=> reject(error))
    })
}