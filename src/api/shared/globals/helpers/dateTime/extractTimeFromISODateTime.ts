export default function extractTimeFromISODateTime(dateTime:string) {
    const time = `${dateTime.split('T')[1].split(":")[0]}:${dateTime.split('T')[1].split(":")[1]}`;
    return time;
}