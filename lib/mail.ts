// Clean mail.js with essential error handling
import nodemailer from 'nodemailer';

// Create transporter
export const transporter = nodemailer.createTransporter({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'rakeshgupta136a@gmail.com',
    pass: process.env.EMAIL_PASS || 'gqrtquffshdylnqi',
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

// Verify SMTP connection
transporter.verify(function(error: any, success: boolean) {
  if (error) {
    console.error('SMTP connection verification failed:', error.message);
  }
});

export const adminTransporter = transporter;

// Send admin order notification email
export async function sendAdminOrderNotificationMail(orderDetails: {
  items?: any[];
  id?: any;
  userEmail?: any;
  total?: any;
  paymentMethod?: any;
  status?: any;
  address?: any;
  createdAt?: string | number | Date;
  [key: string]: any;
}) {
  const adminEmail = "rakeshgupta136a@gmail.com";
  const senderEmail = process.env.EMAIL_USER || 'rakeshgupta136a@gmail.com';
  
  // Validate order details
  if (!orderDetails) {
    throw new Error('Order details are missing');
  }
  
  // Format the items for email display with more details and images
  const itemsHtml = orderDetails.items && Array.isArray(orderDetails.items) && orderDetails.items.length > 0
    ? orderDetails.items
        .map(
          (item) => {
            // Extract product details
            const product = item.product || item;
            const name = product?.name || item?.name || 'Product';
            const quantity = item?.quantity || 1;
            const price = product?.price || item?.price || 0;
            const totalPrice = price * quantity;
            const description = product?.description || item?.description || 'No description available';
            const category = product?.category || item?.category || 'N/A';
            const brand = product?.brand || item?.brand || 'N/A';
            
            // Get the first image if available
            const imageUrl = product?.images && Array.isArray(product.images) && product.images.length > 0 
              ? product.images[0] 
              : (item?.image || 'https://via.placeholder.com/100x100?text=No+Image');
            
            return `<tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="90" valign="top">
                      <img src="${imageUrl}" alt="${name}" style="width: 80px; height: 80px; object-fit: cover; border: 1px solid #ddd;" />
                    </td>
                    <td valign="top" style="padding-left: 10px;">
                      <h3 style="margin: 0; font-size: 16px;">${name}</h3>
                      <p style="margin: 5px 0; font-size: 12px; color: #666;">${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</p>
                      <p style="margin: 5px 0; font-size: 12px;"><strong>Brand:</strong> ${brand}</p>
                      <p style="margin: 5px 0; font-size: 12px;"><strong>Category:</strong> ${category}</p>
                    </td>
                  </tr>
                </table>
              </td>
              <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${quantity}</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">₹${price.toFixed(2)}</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">₹${totalPrice.toFixed(2)}</td>
            </tr>`;
          }
        )
        .join('')
    : '<tr><td colspan="4" style="text-align: center; padding: 10px;">No items</td></tr>';
  
  const mailOptions = {
    from: `72Sports <${senderEmail}>`,
    to: adminEmail,
    subject: `New Order Received! #${orderDetails.id || 'N/A'}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #e63946; border-bottom: 2px solid #e63946; padding-bottom: 10px; }
          h2 { color: #457b9d; margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background-color: #1d3557; color: white; padding: 10px; text-align: left; }
          .order-info { background-color: #f1faee; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .customer-info { background-color: #a8dadc; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .total-row { font-weight: bold; background-color: #f1faee; }
        </style>
      </head>
      <body>
        <h1>New Order Received! #${orderDetails.id || 'N/A'}</h1>
        
        <div class="order-info">
          <h2>Order Information</h2>
          <p><strong>Order ID:</strong> ${orderDetails.id || 'N/A'}</p>
          <p><strong>Date:</strong> ${orderDetails.createdAt ? new Date(orderDetails.createdAt).toLocaleString() : 'N/A'}</p>
          <p><strong>Status:</strong> ${orderDetails.status || 'N/A'}</p>
          <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod || 'N/A'}</p>
          <p><strong>Total Amount:</strong> ₹${orderDetails.total ? orderDetails.total.toFixed(2) : '0.00'}</p>
        </div>
        
        <div class="customer-info">
          <h2>Customer Information</h2>
          <p><strong>Name:</strong> ${orderDetails.userName || 'N/A'}</p>
          <p><strong>Email:</strong> ${orderDetails.userEmail || 'N/A'}</p>
          <p><strong>Phone:</strong> ${orderDetails.phone || (orderDetails.address && orderDetails.address.includes(',') ? orderDetails.address.split(',').pop().trim() : 'N/A')}</p>
          <p><strong>Shipping Address:</strong> ${orderDetails.address || 'N/A'}</p>
        </div>
        
        <h2>Order Details</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Product</th>
              <th style="width: 15%; text-align: center;">Quantity</th>
              <th style="width: 15%; text-align: right;">Unit Price</th>
              <th style="width: 20%; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr class="total-row">
              <td colspan="3" style="text-align: right; padding: 10px; border-top: 2px solid #333;"><strong>Subtotal:</strong></td>
              <td style="text-align: right; padding: 10px; border-top: 2px solid #333;">₹${orderDetails.subtotal ? orderDetails.subtotal.toFixed(2) : (orderDetails.total ? orderDetails.total.toFixed(2) : '0.00')}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3" style="text-align: right; padding: 10px;"><strong>Shipping:</strong></td>
              <td style="text-align: right; padding: 10px;">${orderDetails.shipping === 0 ? "Free" : (orderDetails.shipping ? `₹${orderDetails.shipping.toFixed(2)}` : "₹0.00")}</td>
            </tr>
            ${orderDetails.tax ? `
            <tr class="total-row">
              <td colspan="3" style="text-align: right; padding: 10px;"><strong>Tax:</strong></td>
              <td style="text-align: right; padding: 10px;">₹${orderDetails.tax.toFixed(2)}</td>
            </tr>` : ''}
            <tr class="total-row">
              <td colspan="3" style="text-align: right; padding: 10px; border-top: 2px solid #333;"><strong>Grand Total:</strong></td>
              <td style="text-align: right; padding: 10px; border-top: 2px solid #333;">₹${orderDetails.total ? orderDetails.total.toFixed(2) : '0.00'}</td>
            </tr>
          </tbody>
        </table>
        
        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
          This is an automated notification from 72Sports. Please do not reply to this email.
        </p>
      </body>
      </html>
    `,
  };
  
  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
    
  } catch (error: any) {
    console.error('Failed to send admin notification email:', error.message);
    throw error;
  }
}

// ...existing code...