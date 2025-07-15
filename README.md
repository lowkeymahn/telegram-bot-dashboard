# Telegram Bot Admin Dashboard

A professional admin dashboard for managing Telegram shop bots with full e-commerce functionality.

## 🚀 Features

- **Bot Management**: Configure and monitor Telegram bots
- **Product Management**: Full CRUD operations for products
- **User Management**: Track and manage bot users
- **Order Management**: Monitor orders and payments
- **Payment Integration**: Bitcoin payment support
- **Broadcast System**: Send messages to all users
- **Responsive Design**: Works on all devices
- **Security**: Rate limiting, CORS, and authentication

## 📊 Current Data

- **1 Active Bot**: @UkproevoGb_tsbot
- **2 Products**: Whey Protein Isolate, Creatine Monohydrate
- **2 Users**: Registered and active
- **1 Order**: Sample order data
- **Payment**: Bitcoin wallet configured

## 🛠 Installation

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open browser to: `http://localhost:5000/admin`

### Railway Deployment

1. Create new GitHub repository
2. Upload these files:
   - `server.js`
   - `package.json` (rename from `package-railway.json`)
   - `railway.json`
   - `Procfile`
   - `README.md`

3. Deploy on Railway:
   - Go to railway.app
   - Create new project
   - Connect GitHub repository
   - Deploy automatically

4. Environment variables (optional):
   - `NODE_ENV=production`
   - `PORT=5000`

## 🔑 Login Credentials

- **Username**: admin
- **Password**: admin123

## 📱 Usage

### Dashboard Overview
- View real-time statistics
- Monitor bot performance
- Track user engagement

### Bot Management
- Configure bot settings
- Monitor bot status
- Update bot tokens

### Product Management
- Add new products
- Edit existing products
- Manage inventory
- Set pricing

### User Management
- View registered users
- Track user activity
- Monitor engagement

### Order Management
- Process orders
- Track payments
- Update order status

### Payment Configuration
- Manage Bitcoin wallet
- Configure payment methods
- Monitor transactions

### Broadcast System
- Send messages to all users
- Schedule announcements
- Track message delivery

## 🔧 Technical Details

### Dependencies
- Express.js - Web framework
- Vue.js - Frontend framework
- Helmet - Security middleware
- CORS - Cross-origin resource sharing
- Multer - File upload handling
- Express Rate Limit - API rate limiting

### Security Features
- Rate limiting on API endpoints
- CORS protection
- Security headers with Helmet
- Input validation
- File upload restrictions

### Performance
- Compression middleware
- Optimized for cloud hosting
- Mobile-responsive design
- Fast loading times

## 🌐 API Endpoints

- `GET /` - Redirect to admin dashboard
- `GET /admin` - Admin dashboard interface
- `GET /health` - Health check endpoint
- `GET /api/dashboard-data` - Get all dashboard data
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/broadcasts` - Send broadcast message

## 📈 Monitoring

- Health check endpoint: `/health`
- Real-time statistics in dashboard
- Error logging and handling
- Automatic restart on failure

## 🚀 Deployment Status

Ready for production deployment with:
- Professional UI/UX
- Complete functionality
- Security implemented
- Mobile responsive
- Railway hosting optimized

## 📞 Support

For technical support or questions about the admin dashboard, contact the development team.

---

**Admin Dashboard Version 1.0.0**
*Professional Telegram Bot Management System*