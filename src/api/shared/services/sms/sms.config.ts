import axios from "axios";

export default function sms(recipient:number, message:string) {
    return axios({
        url: process.env.TERMII_API_URL,
        method: 'POST',
        params: {
            api_key: process.env.TERMII_API_KEY,
            from: process.env.TERMII_SENDER_ID,
            to: recipient,
            sms: message,
            type: "plain",
            channel: process.env.TERMII_CHANNEL
        }

    })
}