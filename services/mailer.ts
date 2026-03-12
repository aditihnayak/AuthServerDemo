// Plug in Nodemailer / SendGrid / Twilio here.
// For now, we just log the OTP to the console (development only).

export const sendOtp = async (username: string, otp: string): Promise<void> => {
  console.log(`[MAILER] OTP for ${username}: ${otp}`);
  // Production example with Nodemailer:
  // await transporter.sendMail({
  //   to: user.email,
  //   subject: "Your OTP",
  //   text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  // });
};
