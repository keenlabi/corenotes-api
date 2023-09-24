export function convertDateTimeToUTC(date:string, time:string) {
    const allDateParts = date.split("-");
    const yyyy = parseInt(allDateParts[0]);
    const mm = parseInt(allDateParts[1]) - 1;
    const dd = parseInt(allDateParts[2]);

    const allTimeParts = time.split(":");
    const hr = parseInt(allTimeParts[0]) + 1;
    const min = parseInt(allTimeParts[1]);

    const derivedDate = new Date(yyyy, mm, dd, hr, min).toISOString();
    return derivedDate;
}