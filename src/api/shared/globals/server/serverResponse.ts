import { Response } from "express";

export interface IServerFailure {
  res:Response,
  statusCode:number,
  message:string
}

export interface IServerSuccess {
  res:Response,
  statusCode:number,
  message:string,
  data?:Object
}

export function sendSuccessResponse ({ res, statusCode, message, data }:IServerSuccess):Response {
  return res.status(statusCode).json({
    statusCode,
    status: "SUCCESS",
    message,
    data,
  });
};

export function sendFailureResponse ({ res, statusCode, message }:IServerFailure):Response {
  return res.status(statusCode).json({
    statusCode,
    status: "ERROR",
    message
  });
};
