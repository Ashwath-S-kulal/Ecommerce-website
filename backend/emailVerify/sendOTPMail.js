// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// export const sendOTPMail = async (otp, email) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_PASS,
//     },
//   });

//   const mailConfigurations = {
//     from: `Sanjeevini Group Avarse <${process.env.MAIL_USER}>`,
//     to: email,
//     subject: `Verification Code: ${otp} - Sanjeevini Group`,
//     html: `
//     <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 10px; overflow: hidden;">
//         <div style="background-color: #db2777; padding: 20px; text-align: center;">
//             <h1 style="color: white; margin: 0; font-size: 24px;">Sanjeevini Group Avarse</h1>
//         </div>
//         <div style="padding: 30px; background-color: #ffffff; color: #333333;">
//             <h2 style="color: #1a1a1a;">Verify Your Account</h2>
//             <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
//             <p style="font-size: 16px; line-height: 1.6;">
//                 You are receiving this email because a request was made for a verification code related to your <b>Sanjeevini</b> account. Please use the following One-Time Password (OTP) to proceed:
//             </p>
//             <div style="text-align: center; margin: 30px 0;">
//                 <span style="display: inline-block; padding: 15px 30px; background-color: #fdf2f8; color: #db2777; font-size: 32px; font-weight: bold; letter-spacing: 5px; border: 2px dashed #db2777; border-radius: 8px;">
//                     ${otp}
//                 </span>
//             </div>
//             <p style="font-size: 14px; color: #666666; text-align: center;">
//                 This code is valid for <b>10 minutes</b>. For your security, please do not share this code with anyone.
//             </p>
//             <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
//             <p style="font-size: 12px; color: #999999; text-align: center; line-height: 1.4;">
//                 If you did not request this code, you can safely ignore this email. Someone may have entered your email address by mistake.
//             </p>
//         </div>
//         <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
//             © 2026 Sanjeevini Group Avarse. All rights reserved.
//         </div>
//     </div>
//     `,
//   };

//   transporter.sendMail(mailConfigurations, function (error, info) {
//     if (error) throw Error(error);
//     console.log("OTP sent successfully: ");
//     console.log(info);
//   });
// };

import { Resend } from 'resend';

// Use the Edge runtime for the fastest possible execution on Vercel
export const runtime = 'edge'; 

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPMail = async (otp, email) => {
  try {
    const { data, error } = await resend.emails.send({
      // FIXED: Must include a valid email address. 
      // Use 'onboarding@resend.dev' until you verify your own domain.
      from: 'Sanjeevini Group Avarse <onboarding@resend.dev>', 
      to: email,
      subject: `Verification Code: ${otp} - Sanjeevini Group`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 10px; overflow: hidden;">
//         <div style="background-color: #db2777; padding: 20px; text-align: center;">
//             <h1 style="color: white; margin: 0; font-size: 24px;">Sanjeevini Group Avarse</h1>
//         </div>
//         <div style="padding: 30px; background-color: #ffffff; color: #333333;">
//             <h2 style="color: #1a1a1a;">Verify Your Account</h2>
//             <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
//             <p style="font-size: 16px; line-height: 1.6;">
//                 You are receiving this email because a request was made for a verification code related to your <b>Sanjeevini</b> account. Please use the following One-Time Password (OTP) to proceed:
//             </p>
//             <div style="text-align: center; margin: 30px 0;">
//                 <span style="display: inline-block; padding: 15px 30px; background-color: #fdf2f8; color: #db2777; font-size: 32px; font-weight: bold; letter-spacing: 5px; border: 2px dashed #db2777; border-radius: 8px;">
//                     ${otp}
//                 </span>
//             </div>
//             <p style="font-size: 14px; color: #666666; text-align: center;">
//                 This code is valid for <b>10 minutes</b>. For your security, please do not share this code with anyone.
//             </p>
//             <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
//             <p style="font-size: 12px; color: #999999; text-align: center; line-height: 1.4;">
//                 If you did not request this code, you can safely ignore this email. Someone may have entered your email address by mistake.
//             </p>
//         </div>
//         <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
//             © 2026 Sanjeevini Group Avarse. All rights reserved.
//         </div>
//     </div>
      `,
    });

    if (error) {
      // This will show you EXACTLY why Resend is saying no in your Vercel logs
      console.error("Resend Error Details:", JSON.stringify(error));
      return { success: false, error };
    }

    return { success: true, id: data.id };
  } catch (err) {
    console.error("Vercel Function Crash:", err);
    return { success: false, error: err.message };
  }
};