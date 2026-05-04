// This file wraps the EmailJS send logic for the contact form
import emailjs from "@emailjs/browser";

export async function sendContactEmail({ name, email, message }: { name: string; email: string; message: string }) {
  // Replace with your actual EmailJS service, template, and public key
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  return emailjs.send(
    serviceId,
    templateId,
    {
      from_name: name,
      from_email: email,
      message,
      to_email: "sharma.anahita.as@gmail.com",
    },
    publicKey
  );
}
