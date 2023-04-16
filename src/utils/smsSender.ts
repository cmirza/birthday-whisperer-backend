import twilio from 'twilio';
import logger from '../utils/logger';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function sendSMS(toPhonenumber: string, message: string) {
  try {
    await client.messages.create({
      body: message,
      from: fromPhoneNumber,
      to: toPhonenumber,
    });
    logger.info(`SMS sent to ${toPhonenumber}`);
  } catch (error) {
    logger.error(`Error sending SMS to ${toPhonenumber}`, error);
  }
}