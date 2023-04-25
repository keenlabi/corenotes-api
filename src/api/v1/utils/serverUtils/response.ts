import { Response } from "express";

const sendSuccessResponse = (res:Response, code:number, message:string, data:any) => {
  return res.status(code).json({
    code,
    status: "SUCCESS",
    message,
    data,
  });
};

const sendFailureResponse = (res:Response, code:number, message:string) => {
  return res.status(code).json({
    code,
    status: "ERROR",
    message
  });
};
  
export {
  sendFailureResponse,
  sendSuccessResponse
}