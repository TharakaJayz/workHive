import "dotenv/config";
import { createTransporter } from "./utils/mailer";


async function testEmail() {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "tharakaprabhathoffcial@gmail.com",
    subject: "Test Email",
    text: "Hello from backend 🚀",
  });

  console.log("Email sent");
}

testEmail();