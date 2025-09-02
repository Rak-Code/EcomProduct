import type { NextApiRequest, NextApiResponse } from 'next';

// Helper to authenticate with Shiprocket
async function getShiprocketToken() {
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  const data = await res.json();
  if (!data.token) throw new Error('Shiprocket authentication failed');
  return data.token;
}

// Helper to create order in Shiprocket
async function createShiprocketOrder(order: any, token: string) {
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(order),
  });
  return await res.json();
}

// Example payload builder - adjust fields as per your order structure
function buildShiprocketOrderPayload(orderData: any) {
  return {
    order_id: orderData.id, // Your order ID
    order_date: new Date().toISOString().slice(0, 10),
    pickup_location: 'Primary', // Change as per your Shiprocket panel
    billing_customer_name: orderData.customerName,
    billing_last_name: '',
    billing_address: orderData.address,
    billing_city: orderData.city,
    billing_pincode: orderData.pincode,
    billing_state: orderData.state,
    billing_country: 'India',
    billing_email: orderData.email,
    billing_phone: orderData.phone,
    shipping_is_billing: true,
    order_items: orderData.items.map((item: any) => ({
      name: item.name,
      sku: item.sku || item.id,
      units: item.quantity,
      selling_price: item.price,
    })),
    payment_method: orderData.paymentMethod || 'Prepaid',
    sub_total: orderData.items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0),
    length: 10,
    breadth: 10,
    height: 10,
    weight: 1,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  try {
    const orderData = req.body;
    // Authenticate with Shiprocket
    const token = await getShiprocketToken();
    // Build payload
    const shiprocketPayload = buildShiprocketOrderPayload(orderData);
    // Create order in Shiprocket
    const shiprocketRes = await createShiprocketOrder(shiprocketPayload, token);
    // Optionally: Save shiprocketRes.shipment_id/order_id to your DB if needed
    res.status(200).json({ success: true, shiprocket: shiprocketRes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
