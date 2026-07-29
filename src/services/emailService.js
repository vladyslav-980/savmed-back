import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    throw new Error("Email recipient is required");
  }

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  });

  if (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }

  return data;
};