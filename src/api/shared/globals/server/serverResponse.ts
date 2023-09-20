import { Response } from "express";
import { NotFoundError, ServerError, ValidationError } from "./Error";

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

export function sendNotFoundFailureResponse(res:Response, message:string) {
  const notFoundError = new NotFoundError(message);
  return sendFailureResponse({ res, statusCode:notFoundError.statusCode, message:notFoundError.message })
}

export function sendServerFailureResponse(res:Response, message:string) {
  const serverError = new ServerError();
  return sendFailureResponse({res, statusCode: serverError.statusCode, message: serverError.message});
}

export function sendValidationFailureResponse(res:Response, message:string) {
  const validationError = new ValidationError(message);
  return sendFailureResponse({ res, statusCode: validationError.statusCode, message: validationError.message })
}