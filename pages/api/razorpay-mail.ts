import type { NextApiRequest, NextApiResponse } from 'next';
import { sendPaymentConfirmationMail } from '@/lib/mail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { userEmail, paymentDetails } = req.body;
    if (!userEmail || !paymentDetails) {
      return res.status(400).json({ error: 'Missing userEmail or paymentDetails' });
    }
    await sendPaymentConfirmationMail(userEmail, paymentDetails);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
