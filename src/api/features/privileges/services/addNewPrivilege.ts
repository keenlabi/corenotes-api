import privilegeModel from "../model/privilege.model";
import { IPrivilegeDocument } from "../model/types";
import { ICreatePrivilegeRequest } from "./validateCreatePrivilegeRequest";

export default function addNewPrivilege(newPrivilege:ICreatePrivilegeRequest) {
    return new Promise<IPrivilegeDocument>((resolve, reject)=> {

        privilegeModel.create(newPrivilege)
        .then((createdPrivilege:IPrivilegeDocument)=> resolve(createdPrivilege))
        .catch((error)=> reject(error))
    })
}