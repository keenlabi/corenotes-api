export default function formatDate(dateTime:string) {
    if(!dateTime) return dateTime;
    const date = new Date(dateTime);
    
    const dateString = date.toLocaleDateString('en-us', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return dateString;

    // diffInMilliSecs = Math.floor(today - dateCreated),
    // diffInSecs = Math.floor(diffInMilliSecs / 1000),
    // diffInMins = Math.floor(diffInSecs / 60),
    // diffInHrs = Math.floor(diffInMins / 60),
    // diffInDays = Math.floor(diffInHrs / 24),
    // diffInWeeks = Math.floor(diffInDays / 7),
    // diffInMonths = Math.floor(diffInWeeks / 4),
    // diffInYears = Math.floor(diffInMonths / 12);

    // if(diffInYears > 0) time = `${diffInYears} year${(diffInYears === 1) ?'':'s'}`
    // else if(diffInMonths > 0) time = `${diffInMonths} month${(diffInMonths === 1) ?'':'s'}`
    // else if(diffInWeeks > 0) time = `${diffInWeeks} week${(diffInWeeks === 1) ?'':'s'}`
    // else if(diffInDays > 0) time = `${diffInDays} day${(diffInDays === 1) ?'':'s'}`
    // else if(diffInHrs > 0) time = `${diffInHrs} hr${(diffInHrs === 1) ?'':'s'}`
    // else if(diffInMins > 0) time = `${diffInMins} min${(diffInMins === 1) ?'':'s'}`
    // else if(diffInSecs > 0) time = `${diffInSecs} sec${(diffInSecs === 1) ?'':'s'}`
    // else time = `Less than a sec`

}