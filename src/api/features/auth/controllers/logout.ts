import {
  sendFailureResponse,
  sendSuccessResponse,
} from "@globals/server/serverResponse";
import userModel from "@user/models/user.model";
import { Request, Response } from "express";
import validateLogOutRequestBody from "./validateLogOutRequestBody copy";

export default async function logOut(req: Request, res: Response) {
  const query = { _id: req.currentUser.id };
  validateLogOutRequestBody(req.body)
  .then(({requestBody}) => {
    console.log(requestBody.latitude,'Lat')
  }).catch((err:any) => {
    console.log(err)
  })
  userModel
    .findOneAndUpdate(
      query,
      {
        $set: {
          accessToken: "",
          lastSeen: Date.now(),
        },
      },
      { new: true }
    )
    .then((updatedUser) => {
      console.log(`User successfully logout ${req.currentUser.id}`);
      res.clearCookie("sid");
      console.log(req.body.l);
      return sendSuccessResponse({
        res,
        statusCode: 200,
        message: "User Delete token was a success",
      });
    })
    .catch((error) => {
      console.log("There was an error logging user out: ", error);
      return sendFailureResponse({ res, statusCode: 500, message: error });
    });
}
