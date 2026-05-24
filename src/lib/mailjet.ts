import "server-only";

interface EmailMessage {
  From: { Email: string; Name: string };
  To: Array<{ Email: string; Name: string }>;
  Subject: string;
  HTMLPart: string;
  TextPart?: string;
}

export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const apiKey = process.env.MAILJET_API_KEY!;
  const secretKey = process.env.MAILJET_SECRET_KEY!;
  const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

  const response = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({ Messages: [message] }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Mailjet error:", error);
    return false;
  }

  return true;
}

export function buildConfirmationEmail(params: {
  name: string;
  email: string;
  college: string;
  whatsappChannel: string;
  appUrl: string;
}): EmailMessage {
  const { name, email, college, whatsappChannel, appUrl } = params;

  return {
    From: {
      Email: process.env.MAILJET_FROM_EMAIL || "noreply@metacontest.me",
      Name: process.env.MAILJET_FROM_NAME || "META Contest",
    },
    To: [{ Email: email, Name: name }],
    Subject: "✅ Registration Confirmed — META Contest 2026",
    HTMLPart: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f0f2f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0064E0,#1877F2);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">META Contest</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">India's Most Open Online Contest</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <div style="text-align:center;margin-bottom:32px;">
                <div style="display:inline-block;background:#e7f0ff;border-radius:50%;width:72px;height:72px;line-height:72px;font-size:36px;margin-bottom:16px;">🎉</div>
                <h2 style="margin:0;color:#1c1e21;font-size:24px;font-weight:700;">You're Registered!</h2>
                <p style="margin:8px 0 0;color:#65676b;font-size:15px;">Your registration for META Contest 2026 is confirmed.</p>
              </div>

              <p style="color:#444950;font-size:15px;line-height:1.6;">Hi <strong>${name}</strong>,</p>
              <p style="color:#444950;font-size:15px;line-height:1.6;">We're thrilled to have you on board! Here are your registration details:</p>

              <!-- Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;border-radius:12px;overflow:hidden;margin:24px 0;">
                <tr><td style="padding:20px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #e4e6eb;">
                        <span style="color:#65676b;font-size:13px;">👤 Name</span><br/>
                        <strong style="color:#1c1e21;font-size:15px;">${name}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #e4e6eb;">
                        <span style="color:#65676b;font-size:13px;">🎓 College</span><br/>
                        <strong style="color:#1c1e21;font-size:15px;">${college}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #e4e6eb;">
                        <span style="color:#65676b;font-size:13px;">📅 Exam Date</span><br/>
                        <strong style="color:#1c1e21;font-size:15px;">June 6, 2026 (Online Proctored)</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;">
                        <span style="color:#65676b;font-size:13px;">💰 Payment</span><br/>
                        <strong style="color:#1c1e21;font-size:15px;">₹50 — Confirmed ✅</strong>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>

              <!-- Campus Ambassador CTA -->
              <div style="background:#e7f0ff;border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
                <p style="margin:0 0 8px;color:#0064E0;font-weight:700;font-size:16px;">🎓 Become a Campus Ambassador!</p>
                <p style="margin:0 0 16px;color:#444950;font-size:14px;line-height:1.6;">Represent META Contest in your college, build your leadership skills, and win cash prizes!</p>
                <a href="${appUrl}/ambassador" style="display:inline-block;background:#0064E0;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;">Apply as Campus Ambassador</a>
              </div>

              <!-- WhatsApp CTA -->
              <div style="text-align:center;margin:32px 0;">
                <p style="color:#444950;font-size:15px;margin-bottom:16px;">📲 Get all the important notification and updates directly:</p>
                <a href="${whatsappChannel}" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 32px;border-radius:50px;">Join WhatsApp Channel →</a>
              </div>

              <hr style="border:none;border-top:1px solid #e4e6eb;margin:32px 0;" />

              <p style="color:#65676b;font-size:13px;line-height:1.6;">⚠️ <strong>Check your spam/junk folder</strong> if you don't see future emails. Mark this as "Not Spam" to receive admit cards and results.</p>
              <p style="color:#444950;font-size:15px;line-height:1.6;">Your participation certificate will be issued after the exam.</p>
              <p style="color:#444950;font-size:15px;margin-bottom:4px;">Best of luck! 🚀</p>
              <p style="color:#0064E0;font-weight:700;font-size:15px;margin:0;">Team META Contest</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f0f2f5;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#65676b;font-size:12px;">© 2026 META Contest. All rights reserved. · <a href="${appUrl}" style="color:#0064E0;text-decoration:none;">metacontest.me</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}
