export default function formatTime(dateTime:string) {
    if(!dateTime) return dateTime;

    const date = new Date(dateTime);
    
    const time = date.toLocaleTimeString('en-us', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    if(time.toLowerCase() === "invalid date") {
        const timeParts = dateTime.split(':');
        if(parseInt(timeParts[0]) < 12) {
            return `${dateTime} AM`
        }

        const hour12 = parseInt(timeParts[0]) % 12;
        const transTime = `${hour12.toString().length > 1 ?'' :0}${hour12}:${timeParts[1]}`;

        if(transTime === "00:00") return  "12:00AM"
        return transTime + "PM"
    }

    return time;
}