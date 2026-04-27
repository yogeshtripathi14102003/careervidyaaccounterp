import nodemailer from "nodemailer";

// फंक्शन का नाम sendOTPEmail रखें ताकि इम्पोर्ट एरर न आए
export const sendOTPEmail = async (email, otp, name = "User") => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "careervidyaedutech@gmail.com", // अपना असली Gmail यहाँ डालें
      pass: "hzvs chdv xome ubhh",    // अपना 16-digit App Password यहाँ डालें
      
    },
  });

  const mailOptions = {
    from: '"Career Vidya" <your-email@gmail.com>',
    to: email,
    subject: "Your OTP for Career Vidya",
    // यहाँ आप HTML या Text दोनों भेज सकते हैं
    html: `<h3>Hello ${name},</h3><p>Your OTP is: <b>${otp}</b></p>`, 
  };

  await transporter.sendMail(mailOptions);
};