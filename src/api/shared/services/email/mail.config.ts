import axios from "axios";

interface mailType {
    templateId?:number,
    recipient?:string,
    subject?:string,
    htmlContent?:string,
    templateContent?:{name:string, value:string}[]
}

export default function mail({ recipient, subject, templateId, templateContent }:mailType) {

    const senderEmail:string = process.env.TXN_MAIL_SENDER_EMAIL;
    const senderName:string = process.env.TXN_MAIL_SENDER_NAME;
    
    let templateObject:any = {}
    templateContent?.forEach((content)=> templateObject[content.name] = content.value)

   return axios({
        url: 'https://api.sendinblue.com/v3/smtp/email',
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': process.env.SENDINBLUE_API_KEY!
        },
        data: {
            sender: { 'email': senderEmail, 'name': senderName },
            to: [{ 'email': recipient }],
            subject: subject,
            templateId: templateId,
            params: templateObject,
            replyTo: { "email": senderEmail, "name": senderName }
        }
   })
}