import nodemailer from 'nodemailer';

const sendMail = async({toMail, subject, html}) => {

    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASS_KEY, // generated ethereal password
        },
    });

    const info = await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: [toMail], // list of receivers
        subject, // Subject line
        html // html body
    });

    console.log("Message sent: ", info.messageId);
}

export default sendMail;