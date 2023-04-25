import { Response } from "express";

const sendSuccessResponse = (res:Response, code:number, message:string, data:any) => {
  return res.status(code).json({
    code,
    status: "success",
    message,
    data,
  });
};

const sendFailureResponse = (res:Response, code:number, message:string) => {
  return res.status(code).json({
    code,
    status: "error",
    message
  });
};
  
export {
  sendFailureResponse,
  sendSuccessResponse
}