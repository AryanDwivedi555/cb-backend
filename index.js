const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// 🛡️ SECURITY: Add your Vercel link here once you have it
const allowedOrigins = [
  'http://localhost:8000',
  'http://localhost:5173',
  'https://community-bridge-dwivedi.vercel.app' // Update this later
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy Blocked'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 🛰️ NODEMAILER CONFIG
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// 📩 OTP ENDPOINT
app.post('/api/send-otp', async (req, res) => {
  const { email, otp, name } = req.body;
  try {
    await transporter.sendMail({
      from: `"Intelligence Hub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `MISSION AUTH CODE: ${otp}`,
      text: `Greetings Agent ${name || 'Aryan'}. Your mission verification code is: ${otp}`,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mail Error:", error);
    res.status(500).json({ error: "Uplink Failed" });
  }
});

// 🚀 RENDER DEPLOYMENT FIX
// Do not change the order of these lines
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`--- COMMAND NODE ONLINE ON PORT ${PORT} ---`);
});