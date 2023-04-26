import { Response } from "express";

export function sendSuccessResponse (res:Response, code:number, message:string, data:any) {
  res.status(code).json({
    code,
    status: "SUCCESS",
    message,
    data,
  });
};

export function sendFailureResponse (res:Response, code:number, message:string) {
  res.status(code).json({
    code,
    status: "ERROR",
    message
  });
};