const nodemailer = require('nodemailer');
const { env } = require('../../config/env');

function createTransporter() {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

function getVerificationCopy(purpose) {
  switch (purpose) {
    case 'password_change':
      return {
        subject: 'Verify password change - Moviemon',
        title: 'Verify password change',
        button: 'Verify Password Change',
        textLead: 'Verify your password change: ',
      };
    case 'email_password_change':
      return {
        subject: 'Verify email and password change - Moviemon',
        title: 'Verify email and password change',
        button: 'Verify Changes',
        textLead: 'Verify your email and password change: ',
      };
    case 'email_change':
      return {
        subject: 'Verify email change - Moviemon',
        title: 'Verify email change',
        button: 'Verify Email Change',
        textLead: 'Verify your email change: ',
      };
    case 'verify_email':
    default:
      return {
        subject: 'Verify your email - Moviemon',
        title: 'Verify your email',
        button: 'Verify Email',
        textLead: 'Verify your email: ',
      };
  }
}

async function sendVerificationEmail({ to, token, purpose = 'verify_email' }) {
  const transporter = createTransporter();
  const appBase = env.APP_BASE_URL || '';
  const verifyUrl = `${appBase}/verify-email?token=${encodeURIComponent(
    token
  )}&email=${encodeURIComponent(to)}`;

  const from = env.SMTP_FROM || 'no-reply@moviemon.local';
  const copy = getVerificationCopy(purpose);
  const subject = copy.subject;
  const text = `${copy.textLead}${verifyUrl}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>${copy.title}</h2>
      <p>Click the button below to continue.</p>
      <p><a href="${verifyUrl}" style="background:#f59e0b;color:#000;padding:10px 16px;border-radius:8px;text-decoration:none;">${copy.button}</a></p>
      <p>If the button doesn't work, paste this link into your browser:</p>
      <p>${verifyUrl}</p>
    </div>
  `;

  await transporter.sendMail({ from, to, subject, text, html });
}

function getApprovalCopy(purpose) {
  switch (purpose) {
    case 'email_password_change':
      return {
        subject: 'Approve email and password change - Moviemon',
        title: 'Approve email and password change',
        button: 'Approve Changes',
        textLead: 'Approve your email and password change: ',
      };
    case 'email_change':
    default:
      return {
        subject: 'Approve email change - Moviemon',
        title: 'Approve email change',
        button: 'Approve Email Change',
        textLead: 'Approve your email change: ',
      };
  }
}

async function sendEmailChangeApprovalEmail({ to, token, purpose = 'email_change' }) {
  const transporter = createTransporter();
  const appBase = env.APP_BASE_URL || '';
  const approveUrl = `${appBase}/email-change/approve?token=${encodeURIComponent(
    token
  )}`;

  const from = env.SMTP_FROM || 'no-reply@moviemon.local';
  const copy = getApprovalCopy(purpose);
  const subject = copy.subject;
  const text = `${copy.textLead}${approveUrl}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>${copy.title}</h2>
      <p>Click the button below to approve your change request.</p>
      <p><a href="${approveUrl}" style="background:#f59e0b;color:#000;padding:10px 16px;border-radius:8px;text-decoration:none;">${copy.button}</a></p>
      <p>If the button doesn't work, paste this link into your browser:</p>
      <p>${approveUrl}</p>
    </div>
  `;

  await transporter.sendMail({ from, to, subject, text, html });
}

module.exports = { sendVerificationEmail, sendEmailChangeApprovalEmail };
