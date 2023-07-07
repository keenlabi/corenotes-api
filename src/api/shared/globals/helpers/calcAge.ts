export default function calcAge(dob:string) {
    const birthDate = new Date(dob);

    const timeDiff:number = Math.abs(Date.now() - birthDate.getTime());
    const age:number = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
    return age;
}