import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export async function sendMail(req: string, email: string, emailToken: string) {
    const transporter = nodemailer.createTransport({
        service: "outlook",
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth: {
            user: import.meta.env.OUTLOOK_EMAIL,
            pass: import.meta.env.OUTLOOK_PASS
        }
    });

    const mailOptions = {
        from: `"Teuria" <${import.meta.env.OUTLOOK_EMAIL}>`,
        to: email,
        subject: "Please verify your email in Teuria...",
        html: `<p>Verify your email by cliking in this link</p>
        <br/>
        <a href="${req.replace("register", "verify")}?token=${emailToken}">Click here</a> `
    };

    return await sent(transporter, mailOptions);
}

async function sent(
    transpoter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>,
    mailOptions: Mail.Options
): Promise<SMTPTransport.SentMessageInfo> {
    return new Promise((resolve, reject) => {
        transpoter.sendMail(mailOptions, (err: Error | null, info: SMTPTransport.SentMessageInfo) => {
            if (err) {
                return reject(err);
            }

            return resolve(info);
        });
    });
}