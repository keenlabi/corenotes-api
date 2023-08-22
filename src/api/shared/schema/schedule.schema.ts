import { Schema } from "mongoose";

export interface IServiceScheduleSubDocument {
    startDate:string;
    endDate:string;
    time:Array<string>;
    frequency:string;
    frequencyAttr:number;
}

const serviceScheduleSchema = new Schema<IServiceScheduleSubDocument>({
    startDate:{
        type:String
    },
    endDate:{
        type:String
    },
    time:[String],
    frequency:{
        type:String
    },
    frequencyAttr:{
        type:Number
    },
})

export default serviceScheduleSchema;