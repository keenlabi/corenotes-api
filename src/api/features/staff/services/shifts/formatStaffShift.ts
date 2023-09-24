import formatTime from "@globals/helpers/dateTime/formatTime";
import { IStaffShift } from "@staff/model/types";

export interface IFormatStaffShift {
    id:string;
    date:string;
    startTime:string;
    endTime:string;
}

export default function formatStaffShift(staffShifts:IStaffShift):IFormatStaffShift {
    return {
        id: staffShifts.id,
        date: staffShifts.schedule.date,
        startTime: formatTime(`${staffShifts.schedule.date}T${staffShifts.schedule.startTime}`),
        endTime: formatTime(`${staffShifts.schedule.date}T${staffShifts.schedule.endTime}`)
    }
}