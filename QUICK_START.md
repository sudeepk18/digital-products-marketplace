# 🚀 Quick Start Guide

Get your digital products store running in 10 minutes!

## Step 1: Initial Setup (2 min)

```bash
cd digital-products-marketplace
npm install
```

## Step 2: Database Setup (3 min)

### Using PostgreSQL locally:

```bash
# Create database
createdb digital_products

# Run schema
psql -d digital_products -f database-schema.sql
```

### Or use a hosted database:
- **Vercel Postgres**: Free tier available
- **Supabase**: Free PostgreSQL database
- **Neon**: Serverless PostgreSQL

## Step 3: Create Admin User (2 min)

Create a file `scripts/create-admin.js`:

```javascript
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const password = 'admin123'; // Change this!
  const hash = await bcrypt.hash(password, 10);
  console.log('Password hash:', hash);
  console.log(`
INSERT INTO admin_users (email, password_hash, name) 
VALUES ('admin@example.com', '${hash}', 'Admin User');
  `);
}

createAdmin();
```

Run it:
```bash
node scripts/create-admin.js
```

Copy the output SQL and run it in your database.

## Step 4: Environment Variables (2 min)

Create `.env.local`:

```env
# Minimum required for testing
DATABASE_URL=postgresql://localhost:5432/digital_products
JWT_SECRET=your-secret-key-at-least-32-characters-long
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Get Razorpay Test Keys:**
1. Sign up at https://dashboard.razorpay.com/
2. Use test mode keys for development
3. No KYC needed for test mode!

## Step 5: Run! (1 min)

```bash
npm run dev
```

Visit:
- **Store**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login

## First Steps After Login

### 1. Add Your First Product

Go to Admin Dashboard → Add New Product

**Quick Test Product:**
- **Title**: My First eBook
- **Description**: A sample digital product for testing
- **What You'll Get**: 
  ```
  Complete PDF eBook
  Lifetime access
  Money-back guarantee
  ```
- **Price**: 99
- **Cover Image URL**: `https://picsum.photos/600/400` (use this for testing)
- **File URL**: Any URL (for testing, use `https://example.com/sample.pdf`)

Click **Create Product**

### 2. Test the Purchase Flow

1. Go to homepage (http://localhost:3000)
2. Click on your product
3. Click "Buy Now"
4. Enter test details:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9999999999

5. Use Razorpay test cards:
   - **Card**: 4111 1111 1111 1111
   - **Expiry**: Any future date
   - **CVV**: Any 3 digits
   - **OTP**: 123456 (for 3D Secure)

6. You'll be redirected to download page!

## 🎯 What's Next?

### Production Checklist:

1. **Get Real Razorpay Keys**
   - Complete KYC on Razorpay
   - Switch to live mode keys

2. **Set Up File Storage**
   - Upload to Cloudinary
   - Or use any CDN service

3. **Optional: Email Setup**
   - Configure SMTP in `.env.local`
   - Test email delivery

4. **Deploy to Vercel**
   ```bash
   vercel
   ```

5. **Add Real Products**
   - Upload product files
   - Add attractive cover images
   - Write compelling descriptions

## 📝 Common Issues

### "Database connection failed"
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL is correct

### "Razorpay checkout not opening"
- Check RAZORPAY_KEY_ID in .env.local
- Make sure you're using test keys in development

### "Admin login not working"
- Verify admin user exists in database
- Check JWT_SECRET is set

## 🎨 Customization

Want to change colors? Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    600: '#your-color',
  }
}
```

Want different fonts? Edit `src/app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');

:root {
  --font-display: 'YourFont', sans-serif;
}
```

## 💡 Pro Tips

1. **Test Payments**: Always use test mode until ready for production
2. **Backup Database**: Regular backups are essential
3. **Secure Files**: Use signed URLs for sensitive content
4. **Monitor Orders**: Check admin panel regularly

## 🆘 Need Help?

1. Check the main README.md
2. Review code comments
3. Check Razorpay docs: https://razorpay.com/docs/
4. Next.js docs: https://nextjs.org/docs

---

**You're all set! Start selling digital products! 🎉**
