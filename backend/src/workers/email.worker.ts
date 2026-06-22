import "dotenv/config";
import { workerData } from "worker_threads";
import { createTransporter } from "../utils/mailer";

async function sendEmail() {
    try {
        const transporter = createTransporter();
        const { email, fullName, jobTitle } = workerData;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Application Submitted",
            html: `
                <h2>Application Submitted Successfully</h2>

                <p>Hello ${fullName},</p>

                <p>
                    Your application for
                    <strong>${jobTitle}</strong>
                    has been submitted successfully.
                </p>

                <p>We wish you the best of luck.</p>
            `,
        });

        console.log("[email worker] email sent 📨");
    } catch (error) {
        console.error("[email worker]", error);
    }
}

sendEmail();
