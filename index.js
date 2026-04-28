const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// 🛡️ TACTICAL PERMISSION: Allow your website on port 8000 to talk to this server
app.use(cors({
  origin: 'http://localhost:8000' 
}));
app.use(express.json());

// 🛡️ HARDENED TRANSPORTER: Using manual SSL port 465 for better stability
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Your 16-character App Password
  },
});

app.post('/api/send-otp', async (req, res) => {
  const { email, otp, name, title } = req.body;

  // Log incoming telemetry to your terminal
  console.log(`[INCOMING] Request to send OTP ${otp} to ${email}`);

  const mailOptions = {
    from: `"National Grid Command" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `MISSION AUTH CODE: ${otp}`,
    html: `
      <div style="font-family: sans-serif; padding: 30px; background: #020617; color: white; border-radius: 30px; border: 1px solid #1e293b;">
        <h2 style="color: #3b82f6; text-transform: uppercase; letter-spacing: 2px;">Community Bridge</h2>
        <p style="font-size: 14px; opacity: 0.8;">Uplink Established. Identity Verification Required.</p>
        <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;">
        <p>Hello <b>${name}</b>,</p>
        <p>A mission report has been filed under your credentials: <i>"${title || 'Tactical Request'}"</i></p>
        <div style="background: #0f172a; padding: 30px; border-radius: 20px; text-align: center; margin: 30px 0; border: 2px dashed #3b82f6;">
          <span style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #3b82f6; font-family: monospace;">${otp}</span>
        </div>
        <p style="font-size: 11px; color: #64748b; line-height: 1.6;">
          <b>PROTOCOL:</b> Provide this tactical code to the Response Agent only when the problem is physically resolved. 
          This code serves as a digital signature for mission completion.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [HANDSHAKE SUCCESS] ID: ${info.messageId}`);
    res.status(200).json({ success: true });
  } catch (error) {
    // 🛡️ ERROR DECODER: This will tell you EXACTLY why it failed in the terminal
    console.error("❌ [NODE ERROR]:", error.message);
    res.status(500).json({ error: "Email node offline. Check .env and App Password." });
  }
});

const PORT = 5000;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));