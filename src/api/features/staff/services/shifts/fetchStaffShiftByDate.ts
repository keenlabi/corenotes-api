import staffShiftsModel from "@staff/model/staffshifts.model"
import { IStaffShift } from "@staff/model/types";

export default function fetchStaffShiftByDateAndStaffRef(staffObjId:string, date:string) {
    return new Promise<IStaffShift|null>((resolve, reject)=> {
        const query = { 
            "staffRef": staffObjId,
            "schedule.date": date,
        };
        
        staffShiftsModel.findOne(query)
        .then((foundStaffShift)=> resolve(foundStaffShift))
        .catch((error)=> reject(error))
    })
}