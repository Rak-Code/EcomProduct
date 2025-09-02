import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

  // Verify payment signature
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  // If verification passes, place order in Firestore
  try {
    // Dynamically import your placeOrder function
    const { placeOrder } = await import('@/lib/firebase/orders');
    const { sendOrderConfirmationMail, sendPaymentConfirmationMail, sendAdminOrderNotificationMail } = await import('@/lib/mail');
    const orderId = await placeOrder(orderData);

    // Get user email
    const userEmail = orderData.userEmail || orderData.user?.email;
    let orderMailResult = null;
    let paymentMailResult = null;
    if (userEmail) {
      try {
        console.log('Sending order confirmation email to', userEmail);
        orderMailResult = await sendOrderConfirmationMail(userEmail, { id: orderId, ...orderData });
        console.log('Order confirmation email sent:', orderMailResult.response);
      } catch (err) {
        console.error('Order confirmation email failed:', err);
      }
    }
    if (userEmail && req.body.razorpay_payment_id) {
      try {
        console.log('Sending payment confirmation email to', userEmail);
        paymentMailResult = await sendPaymentConfirmationMail(userEmail, { id: req.body.razorpay_payment_id, ...req.body });
        console.log('Payment confirmation email sent:', paymentMailResult.response);
      } catch (err) {
        console.error('Payment confirmation email failed:', err);
      }
    }
    
    // Send notification to admin
    try {
      console.log('Sending order notification to admin with data:', { id: orderId, ...orderData });
      console.log('Admin email details:', {
        orderId,
        userEmail: orderData.userEmail || orderData.user?.email,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod
      });
      
      const adminMailResult = await sendAdminOrderNotificationMail({ id: orderId, ...orderData });
      console.log('Admin notification email sent successfully:', adminMailResult);
      console.log('Admin notification email response:', adminMailResult.response);
    } catch (err) {
      console.error('Admin notification email failed:', err);
      console.error('Error details:', err instanceof Error ? err.message : 'Unknown error');
      if (err instanceof Error && err.stack) {
        console.error('Error stack:', err.stack);
      }
    }

    return res.status(200).json({ success: true, orderId });
  } catch (err) {
    return res.status(500).json({ error: 'Order placement failed', details: err });
  }
}
