import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail({
  toEmail,
  name,
  actionType, // e.g. "contact inquiry" or "action proposal"
}: {
  toEmail: string;
  name: string;
  actionType: string;
}) {
  try {
    await resend.emails.send({
      from: "Green Collective <support@greencollective.ca>",
      to: [toEmail],
      subject: `We received your Green Collective ${actionType}!`,
      html: `
        <div style="font-family: sans-serif; color: #102f26; padding: 24px; max-width: 600px; background: #f9f8f6; border-radius: 12px;">
          <h2 style="color: #102f26; margin-top: 0;">Thank you for reaching out, ${name || "Eco-Champion"}! 🌱</h2>
          <p style="line-height: 1.6; color: #334842;">
            We have successfully received your ${actionType}. Our administrative team is reviewing your submission and will get back to you shortly if any follow-up is needed.
          </p>
          <p style="line-height: 1.6; color: #334842;">
            Thank you for helping us build a more sustainable community and campus footprint through Green Collective.
          </p>
          <hr style="border: none; border-top: 1px solid #102f26/10; margin: 20px 0;" />
          <p style="font-size: 11px; color: #526760; margin-bottom: 0;">
            Green Collective Admin Team<br>
            <a href="https://greencollective.ca" style="color: #39705d; text-decoration: none;">greencollective.ca</a>
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to send confirmation email:", error);
    return { success: false, error: error.message };
  }
}
