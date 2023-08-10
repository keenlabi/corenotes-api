export default function detMedSchedule(frequency:string, startDate:string, frequencyAttr:number):string {
    if(frequency === 'daily') return 'Everyday';
    if(frequency === 'weekly') {
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

        const dateFormat = new Date(startDate)
        const dayIndex = dateFormat.getUTCDay()
        const dayString = daysOfWeek[dayIndex];

        return `every ${dayString}`;
    }
    if(frequency === 'every-x-days') {
        return `every ${frequencyAttr} days`;
    }
    if(frequency === 'every-x-weeks') {
        const daysOfWeek = ['sundays', 'mondays', 'tuesdays', 'wednesdays', 'thursdays', 'fridays', 'saturdays']

        const dateFormat = new Date(startDate)
        const dayIndex = dateFormat.getUTCDay()
        const dayString = daysOfWeek[dayIndex];

        return `every ${frequencyAttr} ${dayString}`;
    }

    return ''
}