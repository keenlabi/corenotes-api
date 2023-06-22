export default function otpIsExpired(dateGenerated:string, validityInMins:number):boolean {
    const verifDate = new Date(dateGenerated).getTime(); //convert the string to datetime format
    const currentDate = Date.now() //get the current datetime

    const timePassed = currentDate - verifDate; // get the elapsed time between the creation of the code and now in milliseconds
    const limitInMs = validityInMins * 60000; //convert validity from minutes to milliseconds

    if(timePassed <= limitInMs) return false // if the time passed is less than limit in milliseconds otp is still valid
    else return true; // if the time passed is greater than limit in milliseconds otp is expired
}