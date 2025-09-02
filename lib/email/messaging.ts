import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: Number(process.env.SMTP_PORT ?? 465) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

type OrderDetails = {
  id: string;
  userName?: string | null;
  userEmail?: string | null;
  items: Array<{ product: { name: string; price?: number; discountPrice?: number }; quantity: number }>;
  total: number;
  address: string;
  status: string;
  paymentMethod: string;
  createdAt: number;
};

function itemsToText(items: OrderDetails["items"]) {
  return items
    .map(
      (it) =>
        `- ${it.quantity} × ${it.product.name} = ₹${
          ((it.product.discountPrice ?? it.product.price ?? 0) * it.quantity).toFixed(2)
        }`
    )
    .join("\n");
}

export async function sendCustomerOrderEmail(userEmail: string, order: OrderDetails) {
  const from = process.env.FROM_EMAIL ?? process.env.SMTP_USER!;
  const subject = `Order Confirmed • #${order.id}`;
  const text = `Hi ${order.userName ?? "there"},\n\nThanks for your order!\n\nOrder #${order.id}\nTotal: ₹${
    order.total.toFixed(2)
  }\nStatus: ${order.status}\nPayment: ${order.paymentMethod}\n\nItems:\n${itemsToText(order.items)}\n\nShipping:\n${
    order.address
  }\n\nWe’ll notify you when it ships.\n\n— 72Sports`;

  await transporter.sendMail({ to: userEmail, from, subject, text });
}

export async function sendAdminOrderNotification(order: OrderDetails) {
  const from = process.env.FROM_EMAIL ?? process.env.SMTP_USER!;
  const to = process.env.ADMIN_EMAIL!;
  const subject = `New order #${order.id} • ₹${order.total.toFixed(2)} • ${order.userName ?? order.userEmail ?? "Guest"}`;
  const text = `New order received.\n\nOrder: #${order.id}\nWhen: ${new Date(order.createdAt).toLocaleString()}\nCustomer: ${order.userName ?? "N/A"} (${order.userEmail ?? "N/A"})\nTotal: ₹${order.total.toFixed(2)}\nStatus: ${order.status}\nPayment: ${order.paymentMethod}\n\nItems:\n${itemsToText(order.items)}\n\nShip to:\n${order.address}\n`;

  await transporter.sendMail({ to, from, subject, text });
}
// lib/email/messaging.ts
import nodemailer from "nodemailer";
import { generateCustomerEmailHTML, generateAdminEmailHTML } from "./templates";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: Number(process.env.SMTP_PORT ?? 465) === 465, // true for 465
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

type OrderDetails = {
  id: string;
  userName?: string | null;
  userEmail?: string | null;
  items: Array<{ product: { name: string; price?: number; discountPrice?: number }; quantity: number }>;
  total: number;
  address: string;
  status: string;
  paymentMethod: string;
  createdAt: number;
};

function itemsToText(items: OrderDetails["items"]) {
  return items
    .map(
      (it) =>
        `- ${it.quantity} × ${it.product.name} = ₹${
          ((it.product.discountPrice ?? it.product.price ?? 0) * it.quantity).toFixed(2)
        }`
    )
    .join("\n");
}

export async function sendCustomerOrderEmail(userEmail: string, order: OrderDetails) {
  try {
    console.log('🔄 Attempting to send customer email to:', userEmail);
    
    // Check required environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('Missing SMTP configuration. Check SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local');
    }

    const from = process.env.FROM_EMAIL ?? process.env.SMTP_USER!;
    const subject = `Order Confirmed • #${order.id}`;
    const html = generateCustomerEmailHTML(order);

    console.log('📧 Sending customer email with config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from,
      to: userEmail
    });

    const result = await transporter.sendMail({ 
      to: userEmail, 
      from, 
      subject, 
      html,
      text: `Hi ${order.userName ?? "there"},\n\nThanks for your order!\n\nOrder #${order.id}\nTotal: ₹${order.total.toFixed(2)}\nStatus: ${order.status}\nPayment: ${order.paymentMethod}\n\nItems:\n${itemsToText(order.items)}\n\nShipping:\n${order.address}\n\nWe'll notify you when it ships.\n\n— 72Sports`
    });
    console.log('✅ Customer email sent successfully:', result.messageId);
    return result;
  } catch (error: any) {
    console.error('❌ Failed to send customer email:', error.message);
    console.error('Email error details:', error);
    throw new Error(`Customer email failed: ${error.message}`);
  }
}

export async function sendAdminOrderNotification(order: OrderDetails) {
  try {
    console.log('🔄 Attempting to send admin notification email');
    
    // Check required environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('Missing SMTP configuration. Check SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local');
    }

    if (!process.env.ADMIN_EMAIL) {
      throw new Error('Missing ADMIN_EMAIL in .env.local');
    }

    const from = process.env.FROM_EMAIL ?? process.env.SMTP_USER!;
    const to = process.env.ADMIN_EMAIL!;
    const subject = `New order #${order.id} • ₹${order.total.toFixed(2)} • ${order.userName ?? order.userEmail ?? "Guest"}`;
    const html = generateAdminEmailHTML(order);

    console.log('📧 Sending admin email with config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from,
      to
    });

    const result = await transporter.sendMail({ 
      to, 
      from, 
      subject, 
      html,
      text: `New order received.\n\nOrder: #${order.id}\nWhen: ${new Date(order.createdAt).toLocaleString()}\nCustomer: ${order.userName ?? "N/A"} (${order.userEmail ?? "N/A"})\nTotal: ₹${order.total.toFixed(2)}\nStatus: ${order.status}\nPayment: ${order.paymentMethod}\n\nItems:\n${itemsToText(order.items)}\n\nShip to:\n${order.address}`
    });
    console.log('✅ Admin email sent successfully:', result.messageId);
    return result;
  } catch (error: any) {
    console.error('❌ Failed to send admin email:', error.message);
    console.error('Admin email error details:', error);
    throw new Error(`Admin email failed: ${error.message}`);
  }
}
