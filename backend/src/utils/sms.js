const twilio = require('twilio');

const sendOTPSMS = async (phone, otp) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  const hasRealTwilioConfig =
    accountSid &&
    authToken &&
    fromNumber &&
    !accountSid.includes('your_twilio_account_sid') &&
    !authToken.includes('your_twilio_auth_token') &&
    !fromNumber.includes('1234567890');

  if (!hasRealTwilioConfig) {
    console.warn(`OTP for ${phone} (dev mode): ${otp}`);
    return { success: true, devMode: true };
  }

  try {
    const client = twilio(accountSid, authToken);

    await client.messages.create({
      body: `Your Service Booking OTP is ${otp}. It is valid for 5 minutes.`,
      from: fromNumber,
      to: phone
    });

    return { success: true, devMode: false };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, devMode: false, error: error.message };
  }
};

module.exports = { sendOTPSMS };