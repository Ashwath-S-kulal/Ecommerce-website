import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOTPMail = async(otp, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailConfigurations = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "password reset OTP",
    html: `<p>Your OTP for password reset is <b>${otp}</b>. It is 
    valid for 10 minutes.</p>`,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log("OTP sent successfully: ");
    console.log(info);
  });
};
