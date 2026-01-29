# Digital Products Marketplace

A modern, fast web application for selling digital products with instant delivery. Built with Next.js 14, TypeScript, Tailwind CSS, PostgreSQL, and Razorpay integration.

## 🚀 Features

### Public Features
- **Product Listing**: Clean, modern card layout with product images, titles, and prices
- **Product Details**: Detailed product pages with full descriptions and benefits
- **Secure Payments**: Razorpay integration supporting UPI, Cards, Net Banking
- **Instant Delivery**: Automatic product delivery after successful payment
- **Download Management**: Secure download links with expiry and download limits

### Admin Features
- **Dashboard**: Manage all products from a single interface
- **Product Management**: Add, edit, delete, and toggle product visibility
- **Order Management**: View all orders with payment status and buyer details
- **Secure Authentication**: Email/password based admin authentication

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Razorpay account
- Cloudinary account (for file storage) OR direct file hosting
- SMTP server (for email delivery - optional)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd digital-products-marketplace
npm install
```

### 2. Database Setup

Create a PostgreSQL database and run the schema:

```bash
psql -U your_username -d your_database -f database-schema.sql
```

Or manually create the database and run the SQL from `database-schema.sql`.

### 3. Create Admin User

Generate a password hash:

```javascript
// Run this in Node.js console or create a script
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('your-secure-password', 10);
console.log(hash);
```

Then insert into database:

```sql
INSERT INTO admin_users (email, password_hash, name) 
VALUES ('admin@example.com', 'your-bcrypt-hash-here', 'Admin User');
```

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Admin Auth
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
ADMIN_EMAIL=admin@example.com

# Razorpay (Get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Optional - Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
DOWNLOAD_LINK_EXPIRY_HOURS=48
MAX_DOWNLOADS_PER_ORDER=3
```

### 5. Razorpay Setup

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys from Settings > API Keys
3. Set up webhook:
   - Go to Settings > Webhooks
   - Add webhook URL: `https://your-domain.com/api/webhook`
   - Select events: `payment.authorized`, `payment.captured`, `payment.failed`
   - Copy the webhook secret

### 6. File Storage Setup

**Option A: Cloudinary (Recommended)**
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from Dashboard
3. Upload products to Cloudinary
4. Use the Cloudinary URLs in your products

**Option B: Direct URLs**
- Host files on any CDN or storage service
- Use direct HTTPS URLs in product file_url field

### 7. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📱 Usage

### Admin Panel

1. **Login**: Visit `/admin/login`
   - Use the email and password you created
   
2. **Add Product**:
   - Click "Add New Product"
   - Fill in:
     - Title
     - Description
     - What You'll Get (benefits, one per line)
     - Price (in INR)
     - Cover Image URL
     - Product File URL
   - Click "Create Product"

3. **Manage Products**:
   - Toggle Active/Inactive status
   - Edit existing products
   - Delete products
   - View all products

4. **View Orders**:
   - Go to "Orders" tab
   - See all transactions
   - View buyer details
   - Check payment status

### Customer Flow

1. **Browse Products**: Homepage shows all active products
2. **View Details**: Click on a product to see full details
3. **Purchase**:
   - Click "Buy Now"
   - Enter name, email, phone
   - Click "Proceed to Payment"
   - Complete payment on Razorpay
4. **Download**:
   - Redirected to download page
   - Click "Download Product"
   - Receive email with download link

## 🚀 Deployment (Vercel)

### 1. Prepare for Production

```bash
npm run build
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use the Vercel Dashboard:
1. Connect your Git repository
2. Configure environment variables
3. Deploy

### 3. Post-Deployment

1. **Set up PostgreSQL**: Use Vercel Postgres or external provider
2. **Update Environment Variables**: Add all env vars in Vercel dashboard
3. **Configure Razorpay Webhook**: Update webhook URL to production domain
4. **Test Payment Flow**: Make a test purchase

## 🔒 Security Checklist

- ✅ Change default admin password immediately
- ✅ Use strong JWT secret (minimum 32 characters)
- ✅ Enable HTTPS in production
- ✅ Verify Razorpay webhook signatures
- ✅ Set secure cookie flags in production
- ✅ Use environment variables for secrets
- ✅ Implement rate limiting on payment endpoints
- ✅ Regularly backup database

## 📝 API Endpoints

### Public Endpoints
- `GET /api/orders/create` - Create payment order
- `POST /api/orders/verify` - Verify payment
- `POST /api/download/track` - Track downloads
- `POST /api/webhook` - Razorpay webhook

### Admin Endpoints (Require Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/products` - List products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `PATCH /api/admin/products/[id]/toggle` - Toggle active status
- `GET /api/admin/orders` - List orders

## 🎨 Customization

### Branding
1. Update logo in `src/components/Navigation.tsx`
2. Change colors in `tailwind.config.js`
3. Modify fonts in `src/app/globals.css`

### Email Templates
Edit email HTML in `src/lib/email.ts`

### Payment Gateway
To switch from Razorpay:
1. Update `src/lib/razorpay.ts`
2. Modify checkout flow in `src/app/products/[id]/BuyButton.tsx`

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -U username -d database_name
```

### Razorpay Webhook Not Working
- Check webhook URL is correct
- Verify webhook secret matches
- Check server logs for errors
- Test with Razorpay's webhook tester

### Email Not Sending
- Verify SMTP credentials
- Check spam folder
- For Gmail: Use App Password, not regular password
- Email is optional - downloads still work without it

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

MIT License - feel free to use for commercial projects.

## 🤝 Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments
- Check Razorpay documentation
- Review Next.js App Router documentation

## 🎯 Roadmap

- [ ] Bulk product import
- [ ] Analytics dashboard
- [ ] Coupon codes
- [ ] Customer accounts
- [ ] Product variations
- [ ] Affiliate system
- [ ] Multi-admin support

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Custom design system
- **Database**: PostgreSQL with pg driver
- **Payments**: Razorpay
- **Authentication**: JWT with httpOnly cookies
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Deployment**: Vercel

---

Built with ❤️ for digital creators
