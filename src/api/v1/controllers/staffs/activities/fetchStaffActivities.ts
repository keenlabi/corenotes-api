import { Request, Response } from "express"
import ActivityModel from "../../../models/ActivityModel";
import { IActivity } from "../../../models/ActivityModel/types";
import { sendFailureResponse, sendSuccessResponse } from "../../../utils/serverUtils/response";
import { UserModel } from "../../../models";
import { IUser } from "../../../models/UserModel/types";

export default function fetchStaffActivities(req:Request, res:Response) {

    const   pageNumber = parseInt(req.params.pageNumber) - 1 ?? 0,
            resultsPerPage = 10, 
            pageOffset = resultsPerPage * pageNumber,

            query = { assignees: req.params.staffId, category: req.body.activityType };
            
    ActivityModel.find(query)
    .skip(pageOffset)
    .limit(resultsPerPage)
    .sort({ createdAt: -1 })
    .then(async (foundActivities:IActivity[])=> {

        // fetch host information for each activity (10 of them)
        const foundActivitiesWithHostInfo: IActivity[] = [];

        for await (const activity of foundActivities) {
            const query = { _id: activity.host }

            UserModel.findOne(query)
            .then((foundUser:IUser)=> {
                activity.host = `${foundUser.firstname} ${foundUser.lastname}`;
                foundActivitiesWithHostInfo.unshift(activity)
            })
        }

        ActivityModel.count(query)
        .then((totalStaffActivities)=> {
            const totalPageNumber = Math.ceil(totalStaffActivities / resultsPerPage);
            return sendSuccessResponse(res, 200, "Staffs list retrieved successfully", { 
                currentPage: parseInt(req.params.pageNumber), 
                totalPages: totalPageNumber,
                activities: foundActivitiesWithHostInfo
            })
        })
    })
    .catch((error)=> {
        console.log(`QUERY ERROR: There was an error finding the activities for user ${req.params.staffId}`)
        console.log(error)
        return sendFailureResponse(res, 500, "There was an error fetching staff list")
    })

}