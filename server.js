/**
 * MUKILAN R - PORTFOLIO BACKEND SERVER
 * Express API for Contact Form Handling, Email Notifications & Message Storage
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

const app = express();
const PORT = process.env.PORT || 3000;
const RECIPIENT_EMAIL = process.env.CONTACT_EMAIL || 'mukilanravikumar17@gmail.com';
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static portfolio files
app.use(express.static(path.join(__dirname)));

// Ensure messages.json exists
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// --- Helper: Read and Save Messages ---
function readMessages() {
  try {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

function saveMessage(entry) {
  const list = readMessages();
  list.unshift(entry);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

// --- API Endpoint: Contact Form Submission ---
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 1. Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your name, a valid email, and a message.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      });
    }

    // 2. Create message record
    const newEntry = {
      id: 'msg_' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      subject: (subject || 'Portfolio Inquiry').trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      clientIp: req.ip || req.connection.remoteAddress
    };

    // Save to local inbox
    saveMessage(newEntry);
    console.log(`[Contact Form] New message received from ${newEntry.name} (${newEntry.email}): "${newEntry.subject}"`);

    // 3. Optional SMTP Email Sending
    let emailSent = false;
    if (nodemailer && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT, 10) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.sendMail({
          from: `"${newEntry.name}" <${process.env.SMTP_USER}>`,
          replyTo: newEntry.email,
          to: RECIPIENT_EMAIL,
          subject: `[Portfolio Inquiry] ${newEntry.subject}`,
          text: `You received a new message from your portfolio contact form:\n\nName: ${newEntry.name}\nEmail: ${newEntry.email}\nSubject: ${newEntry.subject}\n\nMessage:\n${newEntry.message}\n\n---\nSent at: ${newEntry.createdAt}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #4f46e5; margin-bottom: 16px;">New Portfolio Inquiry</h2>
              <p><strong>Name:</strong> ${newEntry.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${newEntry.email}">${newEntry.email}</a></p>
              <p><strong>Subject:</strong> ${newEntry.subject}</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
              <p><strong>Message:</strong></p>
              <div style="background-color: #f8fafc; padding: 14px; border-radius: 6px; white-space: pre-wrap; color: #334155;">${newEntry.message}</div>
              <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">Sent from Mukilan R's Portfolio Contact Form on ${new Date().toLocaleString()}</p>
            </div>
          `
        });
        emailSent = true;
      } catch (mailErr) {
        console.warn('[Mail Warning] Could not send via SMTP:', mailErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Thank you, ${newEntry.name}! Your message has been received successfully.`,
      emailSent
    });

  } catch (error) {
    console.error('[Contact Error]', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing your message.'
    });
  }
});

// --- API Endpoint: Retrieve Messages Inbox ---
app.get('/api/messages', (req, res) => {
  const list = readMessages();
  res.json({
    success: true,
    count: list.length,
    messages: list
  });
});

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Mukilan R Portfolio Server running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📬 Contact submissions save to: ${MESSAGES_FILE}`);
  console.log(`=======================================================`);
});
