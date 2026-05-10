const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const hasRealSmtpConfig = smtpUser && smtpPass && !smtpUser.includes('your_email') && !smtpPass.includes('your_app_password');

  if (!hasRealSmtpConfig) {
    console.warn(`OTP for ${email} (dev mode): ${otp}`);
    return { success: true, devMode: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const mailOptions = {
      from: `"Service Booking" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify your email - Service Booking',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 1px;">Service Booking</h1>
          </div>
          <div style="padding: 40px; color: #333333; line-height: 1.6;">
            <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px;">Verify Your Email</h2>
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">Thank you for choosing <strong>Service Booking</strong>. Please use the following One-Time Password (OTP) to complete your signup process:</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <div style="display: inline-block; background-color: #f3f4f6; padding: 15px 40px; border-radius: 8px; border: 2px dashed #6366f1;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #6366f1;">${otp}</span>
              </div>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; text-align: center;">This OTP is valid for <strong>5 minutes</strong>. If you didn't request this, please ignore this email.</p>
            
            <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px;">
              <p style="font-size: 14px; color: #9ca3af; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} Service Booking Platform. All rights reserved.</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, devMode: false };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, devMode: false, error: error.message };
  }
};

module.exports = { sendOTPEmail };
