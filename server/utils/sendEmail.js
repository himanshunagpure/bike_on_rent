import getResendClient from "../config/mail.js";

const sendEmail = async (to, subject, text, htmlContent) => {
  try {
    const from = process.env.RESEND_FROM;

    if (!from) {
      throw new Error("RESEND_FROM is not set. Use your verified Resend sender address in the server .env file.");
    }

    // Validate email address
    if (!to || !to.includes("@")) {
      throw new Error(`Invalid recipient email: ${to}`);
    }

    const resend = getResendClient();

    console.log("📧 Sending email to:", to);
    console.log("📧 From:", from);
    console.log("📧 Subject:", subject);

    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      html: htmlContent || text,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      throw new Error(error.message || "Resend email sending failed.");
    }

    console.log("✅ Email sent successfully!");
    console.log("📧 Email ID:", data?.id);
    return { success: true, data };
  } catch (err) {
    console.error("❌ sendEmail FAILED:", err.message);
    return { success: false, error: err.message };
  }
};

export default sendEmail;

// import nodemailer from "nodemailer";

// const sendEmail = async (to, subject, text, htmlContent) => {

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });

//   await transporter.sendMail({
//     from: `"BIKEONRENT 🚴" <${process.env.EMAIL_USER}>`,
//     to: to,
//     subject: subject,
//     text: text,
//     html: htmlContent
//   });

// };

// export default sendEmail;



// import nodemailer from "nodemailer";

// const sendEmail = async (to, subject, text, htmlContent) => {
//   try {
//     console.log("Sending email to:", to);
//     console.log("EMAIL_USER:", process.env.EMAIL_USER);
//     console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     await transporter.sendMail({
//       from: `"BIKEONRENT 🚴" <${process.env.EMAIL_USER}>`,
//       to: to,
//       subject: subject,
//       text: text,
//       html: htmlContent
//     });

//     console.log("Email sent successfully to:", to);

//   } catch (err) {
//     console.error("sendEmail FAILED:", err.message);
//   }
// };

// export default sendEmail;




// import nodemailer from "nodemailer";

// const sendEmail = async (to, subject, text, htmlContent) => {
//   try {
//     console.log("Sending email to:", to);

//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     await transporter.sendMail({
//       from: `"BIKEONRENT 🚴" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//       html: htmlContent
//     });

//     console.log("Email sent successfully to:", to);

//   } catch (err) {
//     console.error("sendEmail FAILED:", err.message);
//   }
// };

// export default sendEmail;





// import { Resend } from "resend";

// // const resend = new Resend(process.env.RESEND_API_KEY);

// const sendEmail = async (to, subject, text, htmlContent) => {
//   try {
//     console.log("Sending email to:", to);
//     await resend.emails.send({
//       from: "BIKEONRENT <onboarding@resend.dev>",
//       to,
//       subject,
//       text,
//       html: htmlContent
//     });
//     console.log("Email sent successfully!");
//   } catch (err) {
//     console.error("sendEmail FAILED:", err.message);
//   }
// };

// export default sendEmail;