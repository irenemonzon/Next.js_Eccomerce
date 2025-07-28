# 🛒 Next.js E-commerce Platform

A modern, full-stack e-commerce web application built with Next.js 15, providing a seamless shopping experience with secure authentication, real-time cart management, and integrated payment processing.

## ✨ Key Features

- 🔐 **Authentication System** - NextAuth.js with multiple providers
- 🛍️ **Product Catalog** - Browse products with search, filtering, and categories
- 🛒 **Shopping Cart** - Real-time cart updates with session persistence
- 💳 **Payment Integration** - Secure PayPal payment processing
- 📦 **Order Management** - Complete order lifecycle from placement to delivery
- 👤 **User Dashboard** - Profile management and order history
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🚀 **Performance Optimized** - Server-side rendering and static generation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Payment**: PayPal SDK
- **Validation**: Zod with React Hook Form
- **Deployment**: Vercel
- **Testing**: Jest

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Neon serverless)

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:irenemonzon/Next.js_Eccomerce.git
   cd Next.js_Eccomerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
      NEXT_PUBLIC_APP_NAME =
      NEXT_PUBLIC_APP_DESCRIPTION = 
      NEXT_PUBLIC_SERVER_URL =
      DATABASE_URL=
      NEXTAUTH_SECRET=
      NEXTAUTH_URL=
      NEXTAUTH_URL_INTERNAL=
      PAYMENT_METHODS="PayPal, Stripe, CashOnDelivery"
      DEFAULT_PAYMENT_METHOD="PayPal"

      PAYPAL_API_URL="https://api-m.sandbox.paypal.com"
      PAYPAL_CLIENT_ID=
      PAYPAL_APP_SECRET=

   ```
   Fill in your database URL, NextAuth secret, and PayPal credentials.

4. **Set up the database**
   ```bash
   npm run postinstall
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (root)/            # Main application pages
│   └── user/              # User dashboard
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```


## 🌐 Live Demo

**Live Application**: [https://next-js-eccomerce-woad.vercel.app/](https://next-js-eccomerce-woad.vercel.app/)
