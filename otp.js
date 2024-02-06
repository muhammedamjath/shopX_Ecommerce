var nodemailer = require("nodemailer")
const controller=require('./controller/common')

// let email=controller.sentEmail
exports.generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

exports.sendOTPEmail = async (email, otp) => {
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },  
      });

    // Set up email options
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'OTP Verification',

        text: `OTP message from shadows
        Your OTP for signup is: ${otp}`,
    };
 
    await transporter.sendMail(mailOptions);
};
 