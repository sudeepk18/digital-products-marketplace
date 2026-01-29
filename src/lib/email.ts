import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendDownloadEmailParams {
  to: string;
  productTitle: string;
  downloadUrl: string;
  buyerName?: string;
}

export async function sendDownloadEmail({
  to,
  productTitle,
  downloadUrl,
  buyerName,
}: SendDownloadEmailParams) {
  const expiryHours = process.env.DOWNLOAD_LINK_EXPIRY_HOURS || '48';
  const maxDownloads = process.env.MAX_DOWNLOADS_PER_ORDER || '3';

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: `Your ${productTitle} is ready!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
          .button { display: inline-block; background: #667eea; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .info-box { background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎉 Thank You for Your Purchase!</h1>
          </div>
          <div class="content">
            ${buyerName ? `<p>Hi ${buyerName},</p>` : '<p>Hi there,</p>'}
            
            <p>Your purchase of <strong>${productTitle}</strong> has been confirmed and your digital product is ready to download!</p>
            
            <div style="text-align: center;">
              <a href="${downloadUrl}" class="button">Download Your Product</a>
            </div>
            
            <div class="info-box">
              <strong>⚠️ Important Information:</strong>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>This download link will expire in <strong>${expiryHours} hours</strong></li>
                <li>You can download the product up to <strong>${maxDownloads} times</strong></li>
                <li>Keep this email safe for future access</li>
              </ul>
            </div>
            
            <p>If you have any questions or issues with your download, please don't hesitate to reach out to our support team.</p>
            
            <p>Enjoy your purchase!</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Download email sent to:', to);
  } catch (error) {
    console.error('Failed to send email:', error);
    // Don't throw error - allow the process to continue even if email fails
  }
}

export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log('Email service is ready');
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
}
