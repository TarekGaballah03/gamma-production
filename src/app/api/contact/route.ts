import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL ?? "390389@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body as {
      name: string;
      email: string;
      subject?: string;
      message: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: "Gamma Portfolio <onboarding@resend.dev>",
      to: [TO_EMAIL],
      replyTo: email,
      subject: subject
        ? `[Gamma Inquiry] ${subject}`
        : `[Gamma Inquiry] Message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h2 style="font-size: 1.5rem; margin-bottom: 24px; color: #0a0a0a;">
            New Inquiry — Gamma Production
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e1da; color: #8a8680; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; width: 120px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e1da; color: #0a0a0a;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e1da; color: #8a8680; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e1da; color: #0a0a0a;">${email}</td>
            </tr>
            ${
              subject
                ? `<tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e1da; color: #8a8680; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em;">Subject</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e1da; color: #0a0a0a;">${subject}</td>
            </tr>`
                : ""
            }
          </table>
          <div style="background: #f0ece4; border-radius: 8px; padding: 20px;">
            <p style="color: #8a8680; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">Message</p>
            <p style="color: #0a0a0a; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 32px; font-size: 0.75rem; color: #8a8680;">
            Sent via Gamma Production portfolio contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
