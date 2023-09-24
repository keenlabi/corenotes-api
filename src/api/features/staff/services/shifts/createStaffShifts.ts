import extractDateFromISODateTime from "@globals/helpers/dateTime/extractDateFromISODateTime";
import extractTimeFromISODateTime from "@globals/helpers/dateTime/extractTimeFromISODateTime";
import staffShiftsModel from "@staff/model/staffshifts.model";
import { IStaffShift } from "@staff/model/types";
import { Types } from "mongoose";

interface ICreateStaffShift {
    staffObjId:string;
    startAt:string;
    endAt:string;
}

export default function createStaffShift(newStaffShift:ICreateStaffShift) {
    return new Promise<IStaffShift>((resolve, reject)=> {

        staffShiftsModel.create({
            _id: new Types.ObjectId,
            staffRef: newStaffShift.staffObjId,
            schedule: {
                date: extractDateFromISODateTime(newStaffShift.startAt),
                startTime: extractTimeFromISODateTime(newStaffShift.startAt),
                endTime: extractTimeFromISODateTime(newStaffShift.endAt),
            }
        })
        .then((createdStaffShift)=> resolve(createdStaffShift))
        .catch((error)=> reject(error))
    });
}