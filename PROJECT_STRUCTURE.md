# 📁 Project Structure

```
digital-products-marketplace/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── admin/                    # Admin panel
│   │   │   ├── login/               # Admin login page
│   │   │   ├── orders/              # Orders management
│   │   │   ├── page.tsx             # Products dashboard
│   │   │   └── ProductsManager.tsx  # Client component for products
│   │   ├── api/                      # API routes
│   │   │   ├── admin/               # Admin APIs
│   │   │   │   ├── login/           # Login endpoint
│   │   │   │   └── products/        # Product CRUD
│   │   │   ├── download/            # Download tracking
│   │   │   ├── orders/              # Order management
│   │   │   │   ├── create/         # Create order
│   │   │   │   └── verify/         # Verify payment
│   │   │   └── webhook/             # Razorpay webhook
│   │   ├── download/                 # Download pages
│   │   │   └── [token]/             # Secure download with token
│   │   ├── products/                 # Product pages
│   │   │   └── [id]/                # Individual product page
│   │   │       ├── page.tsx         # Product details
│   │   │       └── BuyButton.tsx    # Purchase component
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Homepage
│   ├── components/                   # Reusable components
│   │   ├── Navigation.tsx           # Main navigation
│   │   └── ProductCard.tsx          # Product card component
│   └── lib/                          # Utilities and configs
│       ├── auth.ts                  # Authentication utilities
│       ├── db.ts                    # Database connection
│       ├── email.ts                 # Email sending
│       └── razorpay.ts              # Razorpay integration
├── public/                           # Static files
│   └── uploads/                     # Local file uploads (if used)
├── scripts/                          # Utility scripts
│   └── create-admin.js              # Admin user creation
├── database-schema.sql               # Database schema
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore rules
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
├── README.md                         # Main documentation
├── QUICK_START.md                    # Quick start guide
└── DEPLOYMENT.md                     # Deployment guide
```

## 📝 Key Files Explained

### Configuration Files

- **`next.config.js`**: Next.js settings, image optimization
- **`tailwind.config.js`**: Custom design system, colors, fonts
- **`tsconfig.json`**: TypeScript compiler options
- **`package.json`**: Dependencies and scripts

### Database

- **`database-schema.sql`**: Complete PostgreSQL schema
  - Tables: products, orders, admin_users
  - Indexes for performance
  - Triggers for timestamps

### Core Libraries (`src/lib/`)

- **`db.ts`**: PostgreSQL connection pool, query helper
- **`auth.ts`**: JWT authentication, cookie management
- **`razorpay.ts`**: Payment order creation, signature verification
- **`email.ts`**: Transactional email sending

### API Routes (`src/app/api/`)

#### Admin APIs
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `PATCH /api/admin/products/[id]/toggle` - Toggle active status
- `GET /api/admin/orders` - List all orders

#### Public APIs
- `POST /api/orders/create` - Create Razorpay order
- `POST /api/orders/verify` - Verify payment signature
- `POST /api/download/track` - Track download count
- `POST /api/webhook` - Handle Razorpay webhooks

### Pages

#### Public Pages
- `/` - Homepage with product listing
- `/products/[id]` - Product details page
- `/download/[token]` - Secure download page

#### Admin Pages
- `/admin/login` - Admin login
- `/admin` - Products dashboard
- `/admin/orders` - Orders management

### Components

- **`Navigation.tsx`**: Adaptive navigation (public/admin)
- **`ProductCard.tsx`**: Product display card
- **`ProductsManager.tsx`**: Admin products CRUD interface
- **`BuyButton.tsx`**: Purchase and Razorpay integration

## 🔄 Data Flow

### Purchase Flow
```
1. User clicks "Buy Now"
   ↓
2. Client calls /api/orders/create
   ↓
3. Server creates Razorpay order + DB entry
   ↓
4. Client opens Razorpay checkout
   ↓
5. User completes payment
   ↓
6. Client calls /api/orders/verify
   ↓
7. Server verifies signature + updates DB
   ↓
8. Redirect to /download/[token]
   ↓
9. Optional: Webhook updates order status
```

### Download Flow
```
1. User visits /download/[token]
   ↓
2. Server validates token + checks limits
   ↓
3. User clicks "Download"
   ↓
4. Client calls /api/download/track
   ↓
5. Server increments download count
   ↓
6. File download begins
```

## 🎯 Feature Locations

| Feature | Location |
|---------|----------|
| Product listing | `src/app/page.tsx` |
| Product details | `src/app/products/[id]/page.tsx` |
| Payment checkout | `src/app/products/[id]/BuyButton.tsx` |
| Download page | `src/app/download/[token]/page.tsx` |
| Admin dashboard | `src/app/admin/page.tsx` |
| Admin login | `src/app/admin/login/page.tsx` |
| Orders view | `src/app/admin/orders/page.tsx` |
| Database schema | `database-schema.sql` |
| Email templates | `src/lib/email.ts` |

## 🔧 Customization Points

### Design
- Colors: `tailwind.config.js`
- Fonts: `src/app/globals.css`
- Layout: `src/app/layout.tsx`

### Business Logic
- Payment verification: `src/lib/razorpay.ts`
- Email content: `src/lib/email.ts`
- Download limits: `.env.local`

### Database
- Schema changes: `database-schema.sql`
- Queries: `src/lib/db.ts`
- Migrations: Create new SQL files

## 📚 Dependencies

### Core
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety

### Styling
- **Tailwind CSS**: Utility-first CSS
- **Custom fonts**: Syne + DM Sans

### Backend
- **pg**: PostgreSQL client
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication

### Integrations
- **razorpay**: Payment gateway SDK
- **cloudinary**: File storage (optional)
- **nodemailer**: Email sending

## 🚀 Scripts

```bash
# Development
npm run dev           # Start dev server

# Production
npm run build         # Build for production
npm start             # Start production server

# Utilities
node scripts/create-admin.js    # Create admin user
```

## 📖 Documentation Files

- **README.md**: Complete project documentation
- **QUICK_START.md**: 10-minute setup guide
- **DEPLOYMENT.md**: Production deployment guide
- **PROJECT_STRUCTURE.md**: This file

## 💡 Tips

1. **Adding Features**: Start with the database schema
2. **Debugging**: Check browser console and server logs
3. **Testing**: Use Razorpay test mode keys
4. **Performance**: Monitor with Vercel Analytics

## 🔗 Related Files

When working on a feature, you'll typically need:

**Adding a Product:**
- `src/app/admin/ProductsManager.tsx`
- `src/app/api/admin/products/route.ts`
- `database-schema.sql`

**Payment Flow:**
- `src/app/products/[id]/BuyButton.tsx`
- `src/app/api/orders/create/route.ts`
- `src/app/api/orders/verify/route.ts`
- `src/lib/razorpay.ts`

**Email System:**
- `src/lib/email.ts`
- `.env.local` (SMTP config)

---

This structure follows Next.js 14 App Router best practices and is optimized for Vercel deployment.
