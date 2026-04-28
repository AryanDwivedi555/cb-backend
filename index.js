// Version 2.0 - Merged Logic
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  'http://localhost:8000',
  'http://localhost:5173',
  'https://community-bridge-dwivedi.vercel.app' 
  'community-bridge-project1211.vercel.app'
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

// --- MERGED LOGIC: TEST ROUTE ---
app.get("/api/test", (req, res) => {
  res.json({ message: "Grid Uplink Established" });
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

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

// --- MERGED LOGIC: TACTICAL GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("NATIONAL GRID CRITICAL FAILURE:");
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: err.message || "Unexpected tactical condition.",
    stack: process.env.NODE_ENV === 'development' ? err.stack : 'REDACTED'
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`--- COMMAND NODE ONLINE ON PORT ${PORT} ---`);
});