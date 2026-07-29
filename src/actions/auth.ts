"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import nodemailer from "nodemailer"

let transporter: nodemailer.Transporter;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Generate a test ethereal account dynamically
    console.log("Generating new Ethereal test account...");
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }
  return transporter;
}

export async function sendOtp(email: string) {
  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const supabase = createAdminClient()

    // Expire in 10 minutes
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    // Store OTP in database
    // Note: We use insert because multiple OTPs could technically exist,
    // but the query in authorize will just take the latest valid one.
    const { error: dbError } = await (supabase.from('otps') as any).insert({
      email,
      otp,
      expires_at: expiresAt.toISOString(),
    })

    if (dbError) {
      console.error("Database error storing OTP:", dbError)
      return { success: false, error: "Failed to generate OTP" }
    }

    // Send the email
    const mailTransporter = await getTransporter()
    const info = await mailTransporter.sendMail({
      from: '"Journey Finder" <noreply@journeyfinder.com>',
      to: email,
      subject: "Your Journey Finder Login Code",
      text: `Your login code is: ${otp}\n\nIt will expire in 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Welcome to Journey Finder</h2>
          <p>Your login code is:</p>
          <div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 24px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        </div>
      `,
    })

    // Log the Ethereal URL if using the fallback for easy local testing
    if (info.messageId && (!process.env.SMTP_HOST || process.env.SMTP_HOST.includes('ethereal'))) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending OTP:", error)
    return { success: false, error: "Failed to send OTP email" }
  }
}
