export default function extractDateFromISODateTime(dateTime:string) {
    return dateTime?.split('T')[0];
}