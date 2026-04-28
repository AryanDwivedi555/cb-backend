const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// 🛡️ TACTICAL PERMISSION
// Replace the Vercel link with your actual one once you have it!
const allowedOrigins = [
  'http://localhost:8000',
  'http://localhost:5173',
  'https://community-bridge-web.vercel.app' 
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

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false 
  }
});

app.post('/api/send-otp', async (req, res) => {
  const { email, otp, name, title } = req.body;
  try {
    await transporter.sendMail({
      from: `"National Grid Command" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `MISSION AUTH CODE: ${otp}`,
      html: `<h3>Code: ${otp}</h3><p>Agent: ${name}</p>`
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🚀 CRITICAL RENDER FIX: This must be at the very bottom
const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`--- COMMAND NODE ONLINE ON PORT ${PORT} ---`);
});