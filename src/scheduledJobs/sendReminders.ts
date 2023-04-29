import { User, IUser } from "../models/User";
import { sendSMS } from "../utils/smsSender";
import logger from "../utils/logger";
import cron from "node-cron";

const findContactsByBirthday = async (
  date: Date
): Promise<{ user: IUser; filteredContacts: any[] }[]> => {
  const users = await User.find({});
  logger.info(`Found ${users.length} users in the database`);

  return users
    .map((user) => {
      const filteredContacts = user.contacts.filter((contact: any) => {
        const birthdate = new Date(contact.birthdate);
        return (
          birthdate.getDate() === date.getDate() &&
          birthdate.getMonth() === date.getMonth()
        );
      });

      logger.info(
        `User ${user.phone} has ${filteredContacts.length} contacts with birthdays today`
      );
      return { user, filteredContacts };
    })
    .filter((result) => result.filteredContacts.length > 0);
};

const sendBirthdayReminders = async () => {
  const today = new Date();
  const now = new Date();

  logger.info("Sending birthday reminders for", now.toLocaleString());

  try {
    const usersWithBirthdays = await findContactsByBirthday(today);

    for (const { user, filteredContacts } of usersWithBirthdays) {
      const hour = user.reminderTime;

      const currentTime = new Date();
      const timezoneOffset = user.timezone;
      currentTime.setHours(currentTime.getHours() + timezoneOffset);

      if (currentTime.getHours() !== hour) {
        continue;
      }

      const message = `Today's birthdays:\n${filteredContacts
        .map((contact: any) => `- ${contact.name}`)
        .join("\n")}`;

      logger.info(
        `Sending birthday reminder to ${user.phone} - ${user.phone}`
      );
      await sendSMS(user.phone, message);
    }
  } catch (error) {
    logger.error("Error while sending birthday reminders:", error);
  }
};

cron.schedule("0 * * * *", sendBirthdayReminders);
