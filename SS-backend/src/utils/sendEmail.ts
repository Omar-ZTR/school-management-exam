import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (email: string, subject: string, text: string) => {
    try {
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 587,
            secure: true,
            auth: {
                user: 'omarzouiter97@gmail.com',
              pass: 'oukiouki@omr211',
            },
        });
        console.log('Email sent sasxd');
        await transporter.sendMail({
            from: 'omarzouiter97@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.log(error);
        console.log('An error occurred while sending mail');
    }
};

export default sendEmail;
