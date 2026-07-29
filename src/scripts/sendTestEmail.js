import "dotenv/config";

import { sendEmail } from "../services/emailService.js";

const sendTestEmail = async () => {
  try {
    const result = await sendEmail({
      to: process.env.DOCTOR_EMAIL,
      subject: "Тестове повідомлення SavMed",
      html: `
        <div>
          <h1>Resend працює</h1>
          <p>Це тестове повідомлення від backend SavMed.</p>
        </div>
      `,
    });

    console.log(`Test email sent successfully. ID: ${result.id}`);
  } catch (error) {
    console.error("Test email sending failed:", error.message);
    process.exitCode = 1;
  }
};

sendTestEmail();