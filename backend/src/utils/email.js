const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For production, use actual SMTP settings
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // For development, use ethereal.email (fake SMTP)
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER,
      pass: process.env.ETHEREAL_PASS,
    },
  });
};

// Send email
exports.sendEmail = async (options) => {
  const transporter = createTransporter();

  const message = {
    from: `${process.env.FROM_NAME || 'Speedtar'} <${process.env.FROM_EMAIL || 'noreply@speedtar.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
  
  // For development, log the preview URL
  if (process.env.NODE_ENV !== 'production') {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  return info;
};

// Send order confirmation email
exports.sendOrderConfirmation = async (user, order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.total}</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3b82f6;">Order Confirmation</h1>
      <p>Hi ${user.firstName},</p>
      <p>Thank you for your order! We've received your order and will process it shortly.</p>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Details</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: left;">Qty</th>
            <th style="padding: 10px; text-align: left;">Price</th>
            <th style="padding: 10px; text-align: left;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="margin-top: 20px; text-align: right;">
        <p><strong>Subtotal:</strong> $${order.subtotal}</p>
        <p><strong>Shipping:</strong> $${order.shippingCost}</p>
        <p><strong>Tax:</strong> $${order.tax}</p>
        <p style="font-size: 18px; color: #3b82f6;"><strong>Total:</strong> $${order.total}</p>
      </div>

      <p style="margin-top: 30px;">If you have any questions, please contact our support team.</p>
      <p>Thank you for shopping with Speedtar!</p>
    </div>
  `;

  await exports.sendEmail({
    email: user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    message: `Your order ${order.orderNumber} has been confirmed.`,
    html,
  });
};

// Send shipping notification email
exports.sendShippingNotification = async (user, order) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3b82f6;">Your Order Has Shipped!</h1>
      <p>Hi ${user.firstName},</p>
      <p>Great news! Your order has been shipped and is on its way to you.</p>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Shipping Details</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Tracking Number:</strong> ${order.trackingNumber || 'N/A'}</p>
        <p><strong>Shipped Date:</strong> ${new Date(order.shippedAt).toLocaleDateString()}</p>
      </div>

      <p>You can track your order using the tracking number above.</p>
      <p>Thank you for shopping with Speedtar!</p>
    </div>
  `;

  await exports.sendEmail({
    email: user.email,
    subject: `Your Order Has Shipped - ${order.orderNumber}`,
    message: `Your order ${order.orderNumber} has been shipped.`,
    html,
  });
};
