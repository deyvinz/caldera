# NaijaTours Luxury Travel Platform

A premium travel platform connecting affluent travelers to curated, luxury-certified experiences worldwide, starting with Nigeria and scalable to any country.

## 🚀 Features

- **Catalog Management**: Browse destinations and luxury travel packages
- **Booking System**: Secure booking with pricing calculation and partner service freezing
- **Payment Integration**: Stripe webhook handling for secure payments
- **Email Services**: Resend integration with QR code generation
- **Review System**: User reviews and ratings for packages
- **Health Monitoring**: System health checks and monitoring
- **API Documentation**: Swagger/OpenAPI documentation

## 🏗️ Architecture

- **Framework**: NestJS with TypeScript
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Authentication**: Supabase Auth (JWT-based)
- **Validation**: Zod schemas for runtime validation
- **Testing**: Jest with comprehensive test coverage
- **Documentation**: Swagger/OpenAPI with detailed schemas

## 📋 Prerequisites

- Node.js 18+ 
- pnpm 8+
- Supabase account and project
- Stripe account
- Resend account

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd naija-tours-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cd apps/api
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Payments (Stripe)
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...

   # Email (Resend)
   RESEND_API_KEY=re_...

   # App Configuration
   APP_PORT=4000
   APP_BASE_URL=http://localhost:4000
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:cov

# E2E tests
pnpm test:e2e
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:4000/api/docs
- **Health Check**: http://localhost:4000/api/health

## 🔌 API Endpoints

### Health
- `GET /api/health` - System health check

### Catalog
- `GET /api/catalog/destinations` - List destinations with filtering
- `GET /api/catalog/destinations/:slug` - Get destination by slug
- `GET /api/catalog/packages` - List packages with filtering
- `GET /api/catalog/packages/:slug` - Get package by slug
- `GET /api/catalog/packages/:id/composition` - Get package composition

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings` - Get user bookings

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews` - Get package reviews

### Webhooks
- `POST /api/webhooks/stripe` - Stripe payment webhook

### Mailer
- `POST /api/mailer/send-booking-confirmation` - Send booking confirmation
- `POST /api/mailer/send-welcome` - Send welcome email
- `POST /api/mailer/send-password-reset` - Send password reset

## 🗄️ Database Schema

The application uses the following main tables:

- **users**: User profiles and authentication
- **destinations**: Travel destinations with metadata
- **packages**: Travel packages with pricing and details
- **bookings**: User bookings with status tracking
- **reviews**: User reviews and ratings
- **package_item_options**: Customizable package options

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Input Validation**: Zod schemas for all inputs
- **Webhook Verification**: Stripe signature verification
- **Error Handling**: Sanitized error responses
- **CORS Protection**: Configurable cross-origin policies

## 🚀 Deployment

### Production Build
```bash
pnpm build
pnpm start:prod
```

### Environment Variables
Ensure all production environment variables are set:
- Database credentials
- API keys
- Webhook secrets
- Production URLs

### Database Migrations
The application expects the database schema to be already set up via Supabase migrations.

## 📝 Development

### Code Quality
```bash
# Lint code
pnpm lint

# Format code
pnpm format
```

### Adding New Modules
1. Create module directory in `src/modules/`
2. Add DTOs with Zod validation
3. Implement service and controller
4. Add to `app.module.ts`
5. Write tests
6. Update Swagger documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/api/docs`

## 🔮 Roadmap

- [ ] Multi-currency support
- [ ] Advanced pricing engine
- [ ] Partner portal
- [ ] Mobile app
- [ ] AI-powered recommendations
- [ ] Advanced analytics dashboard
