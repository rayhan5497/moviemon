const emailjs = require("@emailjs/nodejs");
const { env } = require("../../config/env");

function getVerificationCopy(purpose) {
  switch (purpose) {
    case "password_change":
      return {
        subject: "Verify password change - Moviemon",
        title: "Verify password change",
        button: "Verify Password Change",
      };

    case "email_password_change":
      return {
        subject: "Verify email and password change - Moviemon",
        title: "Verify email and password change",
        button: "Verify Changes",
      };

    case "email_change":
      return {
        subject: "Verify email change - Moviemon",
        title: "Verify email change",
        button: "Verify Email Change",
      };

    default:
      return {
        subject: "Verify your email - Moviemon",
        title: "Verify your email",
        button: "Verify Email",
      };
  }
}

async function sendVerificationEmail({
  to,
  token,
  purpose = "verify_email",
}) {
  const appBase = env.APP_BASE_URL;

  const verifyUrl =
    `${appBase}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(to)}`;

  const copy = getVerificationCopy(purpose);

  await emailjs.send(
    env.EMAILJS_SERVICE_ID,
    env.EMAILJS_TEMPLATE_ID,
    {
      to_email: to,
      subject: copy.subject,
      title: copy.title,
      button: copy.button,
      verify_url: verifyUrl,
    },
    {
      publicKey: env.EMAILJS_PUBLIC_KEY,
      privateKey: env.EMAILJS_PRIVATE_KEY,
    }
  );
}

async function sendEmailChangeApprovalEmail({ to, token }) {
  const appBase = env.APP_BASE_URL;

  const verifyUrl =
    `${appBase}/email-change/approve?token=${encodeURIComponent(token)}`;

  await emailjs.send(
    env.EMAILJS_SERVICE_ID,
    env.EMAILJS_TEMPLATE_ID,
    {
      to_email: to,
      subject: "Approve email change - Moviemon",
      title: "Approve email change",
      button: "Approve Email Change",
      verify_url: verifyUrl,
    },
    {
      publicKey: env.EMAILJS_PUBLIC_KEY,
      privateKey: env.EMAILJS_PRIVATE_KEY,
    }
  );
}

async function sendPasswordResetEmail({ to, token }) {
  const appBase = env.APP_BASE_URL;

  const verifyUrl =
    `${appBase}/reset-password?token=${encodeURIComponent(token)}`;

  await emailjs.send(
    env.EMAILJS_SERVICE_ID,
    env.EMAILJS_TEMPLATE_ID,
    {
      to_email: to,
      subject: "Reset your password - Moviemon",
      title: "Reset your password",
      button: "Reset Password",
      verify_url: verifyUrl,
    },
    {
      publicKey: env.EMAILJS_PUBLIC_KEY,
      privateKey: env.EMAILJS_PRIVATE_KEY,
    }
  );
}

module.exports = {
  sendVerificationEmail,
  sendEmailChangeApprovalEmail,
  sendPasswordResetEmail,
};