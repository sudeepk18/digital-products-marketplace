# 🚀 Deployment Guide - Vercel

Complete guide to deploy your Digital Products Marketplace to production.

## Prerequisites

- Vercel account (free tier works!)
- GitHub/GitLab repository
- Razorpay account with KYC completed
- PostgreSQL database (Vercel Postgres or external)
- Domain name (optional)

## Part 1: Database Setup

### Option A: Vercel Postgres (Recommended for Vercel)

1. Go to your Vercel dashboard
2. Storage → Create Database → Postgres
3. Copy the connection string
4. Connect via psql:
   ```bash
   psql "your-vercel-postgres-connection-string"
   ```
5. Run the schema:
   ```sql
   -- Copy and paste contents from database-schema.sql
   ```

### Option B: External PostgreSQL (Supabase, Neon, etc.)

1. Create a PostgreSQL database
2. Get the connection string
3. Run the schema file
4. Note the connection string for environment variables

## Part 2: Create Admin User

Run this locally or in database console:

```sql
-- Generate hash using bcryptjs first
-- Password: Choose a STRONG password

INSERT INTO admin_users (email, password_hash, name) 
VALUES (
  'your-admin@email.com',
  'your-bcrypt-hash-from-step-3',
  'Admin Name'
);
```

To generate hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('YourStrongPassword123!', 10))"
```

## Part 3: Razorpay Setup (Production)

1. **Complete KYC** on Razorpay Dashboard
2. Switch to **Live Mode**
3. Get Live API Keys:
   - Dashboard → Settings → API Keys
   - Generate Key ID and Key Secret
4. Set up Webhook:
   - Dashboard → Settings → Webhooks
   - Add Webhook URL: `https://your-domain.com/api/webhook`
   - Select Events:
     - ✓ payment.authorized
     - ✓ payment.captured
     - ✓ payment.failed
   - Copy Webhook Secret

## Part 4: File Storage Setup

### Cloudinary Setup:

1. Sign up at cloudinary.com
2. Dashboard → Settings → Upload
3. Create upload preset:
   - Name: `digital-products`
   - Signing Mode: Signed
   - Folder: `products`
4. Note your:
   - Cloud Name
   - API Key
   - API Secret

### Upload Your Products:

```javascript
// Example upload script
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret',
});

async function uploadProduct() {
  const result = await cloudinary.uploader.upload('local-file.pdf', {
    folder: 'products',
    resource_type: 'raw',
  });
  console.log('URL:', result.secure_url);
}
```

## Part 5: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration

1. Push code to GitHub
2. Go to vercel.com
3. Import Project → Select Repository
4. Configure → Deploy

## Part 6: Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```env
# Database
DATABASE_URL=your_postgres_connection_string

# Auth
JWT_SECRET=super-secret-key-minimum-32-characters-change-this

# Razorpay (LIVE MODE)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_live_secret
RAZORPAY_WEBHOOK_SECRET=webhook_secret_from_razorpay

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Optional but recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# App Config
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
DOWNLOAD_LINK_EXPIRY_HOURS=48
MAX_DOWNLOADS_PER_ORDER=3
```

**Important**: Apply to all environments (Production, Preview, Development)

## Part 7: Domain Setup (Optional)

1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update NEXT_PUBLIC_APP_URL to your domain
5. Update Razorpay webhook URL to your domain

## Part 8: Post-Deployment Testing

### 1. Test Admin Login
- Visit: `https://your-domain.com/admin/login`
- Login with your admin credentials
- ✅ Should redirect to dashboard

### 2. Add Test Product
- Add a product with test file URLs
- Make it active
- ✅ Should appear on homepage

### 3. Test Payment Flow
Use Razorpay test cards in live mode:
- Go to product page
- Click "Buy Now"
- Enter details
- Use test card: 4111 1111 1111 1111
- ✅ Payment should succeed
- ✅ Should redirect to download page
- ✅ Email should be received

### 4. Test Download
- Click download button
- ✅ File should download
- ✅ Download count should increment
- ✅ Link should expire after set time

### 5. Test Webhook
- Make a purchase
- Check Razorpay Dashboard → Webhooks
- ✅ Should show successful webhook delivery
- ✅ Order status should update in admin panel

## Part 9: Security Hardening

```bash
# 1. Update all secrets
- Change JWT_SECRET to a random 32+ char string
- Use unique passwords
- Rotate keys periodically

# 2. Enable Security Headers
# Add to next.config.js:
```

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

## Part 10: Monitoring Setup

### Vercel Analytics
1. Enable in Vercel Dashboard
2. Monitor page views, performance

### Database Monitoring
1. Set up alerts for connection issues
2. Monitor query performance
3. Regular backups

### Razorpay Monitoring
1. Set up email alerts for payments
2. Monitor webhook success rate
3. Check dashboard daily

## Troubleshooting Production Issues

### Webhook Not Working
```bash
# Check webhook logs in Razorpay dashboard
# Common issues:
1. Wrong webhook URL
2. Incorrect webhook secret
3. Firewall blocking Razorpay IPs
```

### Database Connection Issues
```bash
# Check connection string
# Ensure database allows connections from Vercel IPs
# Check SSL settings
```

### Email Not Sending
```bash
# For Gmail:
1. Enable 2FA
2. Create App Password
3. Use App Password in SMTP_PASSWORD
```

### Build Fails
```bash
# Clear Vercel cache
vercel --force

# Check build logs
# Common issues:
- Missing environment variables
- TypeScript errors
- Import errors
```

## Maintenance Checklist

### Daily
- [ ] Check new orders in admin panel
- [ ] Verify payment webhook deliveries
- [ ] Monitor error logs

### Weekly
- [ ] Backup database
- [ ] Review customer emails/issues
- [ ] Check storage usage
- [ ] Update product inventory

### Monthly
- [ ] Review and optimize database
- [ ] Update dependencies
- [ ] Check security advisories
- [ ] Review payment reports

## Scaling Considerations

### When to Scale

**Traffic > 1000 orders/month:**
- Consider Vercel Pro plan
- Upgrade database plan
- Add CDN for files

**Traffic > 10000 orders/month:**
- Implement caching
- Add Redis for sessions
- Consider dedicated database
- Add payment queue system

### Performance Optimization

```javascript
// 1. Add edge caching
export const runtime = 'edge';
export const revalidate = 60;

// 2. Optimize images
// Already using Next.js Image optimization

// 3. Add database connection pooling
// Already implemented in lib/db.ts
```

## Backup Strategy

### Automated Backups

```bash
# Set up daily database backups
# For Vercel Postgres:
# Use Vercel's built-in backup feature

# For external databases:
pg_dump your_database > backup_$(date +%Y%m%d).sql
```

### Backup Checklist
- [ ] Database backups (daily)
- [ ] Product files (weekly)
- [ ] Environment variables (secure storage)
- [ ] Code repository (GitHub)

## Support & Updates

### Getting Help
1. Check Vercel status page
2. Review Razorpay documentation
3. Check GitHub issues (if using template)

### Keeping Updated
```bash
# Update dependencies monthly
npm update

# Check for security issues
npm audit

# Test in preview before production
vercel
```

---

## 🎉 Congratulations!

Your digital products marketplace is now live!

**Next Steps:**
1. Add your real products
2. Set up marketing pages
3. Implement SEO optimization
4. Start promoting!

**Remember:**
- Monitor your store daily
- Keep everything backed up
- Respond to customers quickly
- Keep improving based on feedback

**Good luck with your digital products business! 🚀**
