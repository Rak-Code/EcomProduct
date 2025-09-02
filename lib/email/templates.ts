// lib/email/templates.ts

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

export function generateCustomerEmailHTML(order: OrderDetails): string {
  const itemsHTML = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 600; color: #1f2937; font-size: 16px; margin-bottom: 4px;">${item.product.name}</div>
            <div style="color: #6b7280; font-size: 14px;">Quantity: ${item.quantity}</div>
          </td>
          <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            <div style="font-weight: 700; color: #1f2937; font-size: 16px;">₹${((item.product.discountPrice ?? item.product.price ?? 0) * item.quantity).toFixed(2)}</div>
          </td>
        </tr>
      `
    )
    .join("");

  const statusColor = order.status === 'confirmed' ? '#10b981' : order.status === 'processing' ? '#f59e0b' : '#6b7280';
  const paymentMethodDisplay = order.paymentMethod === 'cod' ? 'Cash on Delivery 💵' : 'Online Payment 💳';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Paribito</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    /* Gmail-specific styles */
    .gmail-fix {
      display: block !important;
      width: 100% !important;
      max-width: 600px !important;
      margin: 0 auto !important;
    }
    
    /* Responsive styles */
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
      .header { padding: 30px 20px !important; }
      .content { padding: 30px 20px !important; }
      .grid { display: block !important; }
      .grid-item { margin-bottom: 16px !important; }
      .table-responsive { font-size: 14px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; line-height: 1.6;">
  
  <!-- Preheader -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    Your order #${order.id} for ₹${order.total.toFixed(2)} has been confirmed! 🎉
  </div>

  <div class="gmail-fix" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    
    <!-- Header with Gradient -->
    <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
      <!-- Decorative circles -->
      <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%; opacity: 0.7;"></div>
      <div style="position: absolute; bottom: -30px; left: -30px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%; opacity: 0.5;"></div>
      
      <div style="position: relative; z-index: 2;">
        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          🏆 Paribito
        </h1>
        <p style="margin: 12px 0 0 0; color: #ffffff; font-size: 18px; opacity: 0.95; font-weight: 500;">
          Order Confirmation
        </p>
      </div>
    </div>

    <!-- Success Banner -->
    <div style="background: linear-gradient(90deg, #10b981, #059669); padding: 20px 30px; text-align: center;">
      <div style="color: white; font-size: 18px; font-weight: 600;">
        ✅ Order Successfully Placed!
      </div>
      <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 4px;">
        Thank you for choosing Paribito
      </div>
    </div>

    <!-- Main Content -->
    <div class="content" style="padding: 40px 30px;">
      
      <!-- Personalized Greeting -->
      <div style="text-align: center; margin-bottom: 35px;">
        <h2 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: 700;">
          Hello ${order.userName || "Valued Customer"}! 👋
        </h2>
        <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 17px; line-height: 1.6;">
          Your order has been received and is being processed with care.
        </p>
      </div>

      <!-- Order Summary Card -->
      <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; padding: 28px; margin-bottom: 32px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h3 style="margin: 0 0 20px 0; color: #374151; font-size: 20px; font-weight: 700; display: flex; align-items: center;">
          📋 Order Summary
        </h3>
        
        <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div class="grid-item">
            <div style="background: #ffffff; padding: 16px; border-radius: 12px; border-left: 4px solid #667eea; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">Order Number</p>
              <p style="margin: 6px 0 0 0; color: #1f2937; font-weight: 700; font-size: 18px;">#${order.id}</p>
            </div>
          </div>
          <div class="grid-item">
            <div style="background: #ffffff; padding: 16px; border-radius: 12px; border-left: 4px solid #10b981; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">Order Date</p>
              <p style="margin: 6px 0 0 0; color: #1f2937; font-weight: 700; font-size: 16px;">${new Date(order.createdAt).toLocaleDateString('en-IN', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
          <div class="grid-item">
            <div style="background: #ffffff; padding: 16px; border-radius: 12px; border-left: 4px solid #f59e0b; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">Payment Method</p>
              <p style="margin: 6px 0 0 0; color: #1f2937; font-weight: 700; font-size: 16px;">${paymentMethodDisplay}</p>
            </div>
          </div>
          <div class="grid-item">
            <div style="background: #ffffff; padding: 16px; border-radius: 12px; border-left: 4px solid ${statusColor}; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">Status</p>
              <p style="margin: 6px 0 0 0; color: ${statusColor}; font-weight: 700; font-size: 16px; text-transform: capitalize;">
                ${order.status} ${order.status === 'confirmed' ? '✅' : '⏳'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 32px;">
        <h3 style="margin: 0 0 20px 0; color: #374151; font-size: 20px; font-weight: 700; display: flex; align-items: center;">
          🛒 Your Items
        </h3>
        <div style="border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
          <table class="table-responsive" style="width: 100%; border-collapse: collapse; background-color: #ffffff;">
            ${itemsHTML}
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <td style="padding: 20px; font-weight: 700; color: #ffffff; font-size: 18px;">
                💰 Total Amount
              </td>
              <td style="padding: 20px; text-align: right; font-weight: 700; color: #ffffff; font-size: 22px;">
                ₹${order.total.toFixed(2)}
              </td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Shipping Address -->
      <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 16px; padding: 24px; margin-bottom: 32px; border: 1px solid #bfdbfe;">
        <h3 style="margin: 0 0 16px 0; color: #1e40af; font-size: 20px; font-weight: 700; display: flex; align-items: center;">
          🚚 Delivery Address
        </h3>
        <div style="background: #ffffff; padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <p style="margin: 0; color: #1f2937; line-height: 1.7; font-size: 16px; white-space: pre-line; font-weight: 500;">${order.address}</p>
        </div>
      </div>

      <!-- What's Next Section -->
      <div style="text-align: center; padding: 28px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; border: 1px solid #f59e0b; margin-bottom: 32px;">
        <div style="font-size: 48px; margin-bottom: 12px;">📦</div>
        <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 22px; font-weight: 700;">What Happens Next?</h3>
        <p style="margin: 0; color: #92400e; line-height: 1.7; font-size: 16px; font-weight: 500;">
          We're preparing your order for shipment. You'll receive a tracking email once it's on the way to you!
        </p>
      </div>

      <!-- Support Section -->
      <div style="text-align: center; padding: 24px; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
        <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 18px; font-weight: 600;">Need Help? 🤝</h4>
        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
          Our support team is here to help! Contact us anytime for questions about your order.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #1f2937; padding: 32px 30px; text-align: center;">
      <div style="margin-bottom: 16px;">
        <h4 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">🏆 Paribito</h4>
      </div>
      <p style="margin: 0 0 12px 0; color: #d1d5db; font-size: 16px; font-weight: 500;">
        Thank you for choosing us for your sporting needs!
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 14px;">
        This email was sent regarding your order. Please keep it for your records.
      </p>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
        <p style="margin: 0; color: #6b7280; font-size: 12px;">
          © 2025 Paribito. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateAdminEmailHTML(order: OrderDetails): string {
  const itemsHTML = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: 500;">${item.product.name}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #374151; font-weight: 600;">${item.quantity}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 700; color: #1f2937;">₹${((item.product.discountPrice ?? item.product.price ?? 0) * item.quantity).toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  const urgencyLevel = order.total >= 5000 ? '🔥 HIGH VALUE' : order.total >= 2000 ? '⚡ MEDIUM' : '📝 STANDARD';
  const urgencyColor = order.total >= 5000 ? '#dc2626' : order.total >= 2000 ? '#f59e0b' : '#10b981';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Alert - Paribito Admin</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    .gmail-fix {
      display: block !important;
      width: 100% !important;
      max-width: 650px !important;
      margin: 0 auto !important;
    }
    
    @media screen and (max-width: 650px) {
      .container { width: 100% !important; padding: 15px !important; }
      .grid { display: block !important; }
      .grid-item { margin-bottom: 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; line-height: 1.6;">
  
  <!-- Preheader -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    🚨 NEW ORDER: #${order.id} • ₹${order.total.toFixed(2)} • ${order.userName || order.userEmail || "Guest"}
  </div>

  <div class="gmail-fix" style="max-width: 650px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Alert Header -->
    <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center; position: relative; overflow: hidden;">
      <!-- Pulsing effect -->
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); animation: pulse 2s ease-in-out infinite;"></div>
      
      <div style="position: relative; z-index: 2;">
        <div style="font-size: 48px; margin-bottom: 8px;">🚨</div>
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
          NEW ORDER ALERT
        </h1>
        <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95; font-weight: 500;">
          Paribito Admin Dashboard
        </p>
      </div>
    </div>

    <!-- Urgency Banner -->
    <div style="background: ${urgencyColor}; padding: 16px 30px; text-align: center;">
      <div style="color: white; font-size: 16px; font-weight: 700;">
        ${urgencyLevel} ORDER • ₹${order.total.toFixed(2)}
      </div>
    </div>

    <!-- Main Content -->
    <div style="padding: 32px 30px;">
      
      <!-- Quick Order Info -->
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 24px; margin-bottom: 28px; border-left: 6px solid #f59e0b; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h2 style="margin: 0; color: #92400e; font-size: 24px; font-weight: 800;">
            ORDER #${order.id}
          </h2>
          <div style="background: #92400e; color: white; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 600;">
            ${new Date(order.createdAt).toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
        </div>
        <div style="color: #92400e; font-size: 18px; font-weight: 700;">
          Total: ₹${order.total.toFixed(2)}
        </div>
      </div>

      <!-- Customer & Order Details Grid -->
      <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px;">
        <div class="grid-item" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 24px; border-radius: 16px; border: 1px solid #0ea5e9;">
          <h3 style="margin: 0 0 16px 0; color: #0c4a6e; font-size: 18px; font-weight: 700; display: flex; align-items: center;">
            👤 Customer Details
          </h3>
          <div style="space-y: 8px;">
            <div style="background: #ffffff; padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #0ea5e9;">
              <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: 500;">NAME</p>
              <p style="margin: 2px 0 0 0; color: #0f172a; font-weight: 600; font-size: 16px;">${order.userName || "N/A"}</p>
            </div>
            <div style="background: #ffffff; padding: 12px; border-radius: 8px; border-left: 3px solid #0ea5e9;">
              <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: 500;">EMAIL</p>
              <p style="margin: 2px 0 0 0; color: #0f172a; font-weight: 600; font-size: 14px; word-break: break-all;">${order.userEmail || "N/A"}</p>
            </div>
          </div>
        </div>
        
        <div class="grid-item" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 24px; border-radius: 16px; border: 1px solid #16a34a;">
          <h3 style="margin: 0 0 16px 0; color: #15803d; font-size: 18px; font-weight: 700; display: flex; align-items: center;">
            📋 Order Info
          </h3>
          <div style="space-y: 8px;">
            <div style="background: #ffffff; padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #16a34a;">
              <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: 500;">DATE & TIME</p>
              <p style="margin: 2px 0 0 0; color: #0f172a; font-weight: 600; font-size: 15px;">${new Date(order.createdAt).toLocaleString('en-IN')}</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="background: #ffffff; padding: 12px; border-radius: 8px; border-left: 3px solid #16a34a;">
                <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 500;">PAYMENT</p>
                <p style="margin: 2px 0 0 0; color: #0f172a; font-weight: 600; font-size: 13px;">${order.paymentMethod === 'cod' ? 'COD 💵' : 'Online 💳'}</p>
              </div>
              <div style="background: #ffffff; padding: 12px; border-radius: 8px; border-left: 3px solid #16a34a;">
                <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 500;">STATUS</p>
                <p style="margin: 2px 0 0 0; color: #16a34a; font-weight: 700; font-size: 13px; text-transform: uppercase;">${order.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 28px;">
        <h3 style="margin: 0 0 20px 0; color: #374151; font-size: 20px; font-weight: 700; display: flex; align-items: center;">
          📦 Order Items
        </h3>
        <div style="border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
          <table style="width: 100%; border-collapse: collapse; background-color: #ffffff;">
            <thead>
              <tr style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%);">
                <th style="padding: 16px; text-align: left; font-weight: 700; color: #ffffff; font-size: 14px;">PRODUCT</th>
                <th style="padding: 16px; text-align: center; font-weight: 700; color: #ffffff; font-size: 14px;">QTY</th>
                <th style="padding: 16px; text-align: right; font-weight: 700; color: #ffffff; font-size: 14px;">PRICE</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
              <tr style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);">
                <td colspan="2" style="padding: 20px; font-weight: 800; color: #ffffff; font-size: 18px;">💰 TOTAL AMOUNT</td>
                <td style="padding: 20px; text-align: right; font-weight: 800; color: #ffffff; font-size: 22px;">₹${order.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Shipping Address -->
      <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 16px; padding: 24px; margin-bottom: 28px; border-left: 6px solid #3b82f6;">
        <h3 style="margin: 0 0 16px 0; color: #1e40af; font-size: 18px; font-weight: 700; display: flex; align-items: center;">
          🏠 Shipping Address
        </h3>
        <div style="background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #bfdbfe; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <p style="margin: 0; color: #1f2937; line-height: 1.7; font-size: 16px; white-space: pre-line; font-weight: 500;">${order.address}</p>
        </div>
      </div>

      <!-- Action Required -->
      <div style="text-align: center; padding: 28px; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 16px; border: 2px solid #16a34a; margin-bottom: 24px; position: relative;">
        <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #16a34a; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700;">
          URGENT
        </div>
        <div style="font-size: 48px; margin-bottom: 12px;">⚡</div>
        <h3 style="margin: 0 0 12px 0; color: #15803d; font-size: 22px; font-weight: 800;">ACTION REQUIRED</h3>
        <p style="margin: 0; color: #15803d; font-size: 16px; font-weight: 600; line-height: 1.6;">
          Please process this order immediately and update the shipping status in your admin panel.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #1f2937; padding: 24px 30px; text-align: center;">
      <h4 style="margin: 0 0 8px 0; color: #ffffff; font-size: 18px; font-weight: 700;">Paribito Admin System</h4>
      <p style="margin: 0; color: #9ca3af; font-size: 14px;">
        Automated order notification • ${new Date().toLocaleString('en-IN')}
      </p>
    </div>
  </div>
</body>
</html>
  `;
}