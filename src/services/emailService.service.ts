import 'dotenv/config';
import nodemailer, { SendMailOptions } from 'nodemailer';


const sendEmail = async (subject: string, text: string, to: string, attachmentPath: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || '',
            pass: process.env.EMAIL_PASS || '',
        },
    });

    const mailOptions: SendMailOptions = {
        from: process.env.EMAIL_USER || '',
        to,
        subject,
        text,
        attachments: [{ path: attachmentPath }],
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado:', info);
        return { success: true, message: 'E-mail enviado com sucesso!' };
    } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        return { success: false, message: 'Erro ao enviar o e-mail.' };
    }
};

export default sendEmail;
