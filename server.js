const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Middleware
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Data from your current preview
let dashboardData = {
  bots: [
    {
      id: '1',
      name: 'UkproevoGb_tsbot',
      token: '8173254652:AAEAJ28P3rFQhwE671zShV8tFtQl2p6zR6c',
      status: 'active',
      welcomeMessage: 'Welcome to our premium supplement store! 🏋️‍♂️\n\nBrowse our high-quality protein powders and supplements to fuel your fitness journey.',
      createdAt: new Date().toISOString()
    }
  ],
  products: [
    {
      id: '1',
      name: 'Whey Protein Isolate',
      price: 45.99,
      description: 'Premium whey protein isolate with 25g protein per serving. Fast-absorbing and perfect for post-workout recovery.',
      category: 'Protein Powders',
      stock: 50,
      image: '/uploads/whey-protein.jpg',
      botId: '1'
    },
    {
      id: '2',
      name: 'Creatine Monohydrate',
      price: 24.99,
      description: 'Pure creatine monohydrate for increased strength, power, and muscle volume. 5g per serving.',
      category: 'Supplements',
      stock: 40,
      image: '/uploads/creatine.jpg',
      botId: '1'
    }
  ],
  users: [
    {
      id: '1',
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      lastActive: new Date().toISOString(),
      botId: '1'
    },
    {
      id: '2',
      username: 'jane_smith',
      firstName: 'Jane',
      lastName: 'Smith',
      lastActive: new Date().toISOString(),
      botId: '1'
    }
  ],
  orders: [
    {
      id: '1',
      userId: '1',
      products: [{ id: '1', quantity: 2, price: 45.99 }],
      total: 91.98,
      status: 'completed',
      createdAt: new Date().toISOString(),
      botId: '1'
    }
  ],
  categories: [
    { id: '1', name: 'Protein Powders', botId: '1' },
    { id: '2', name: 'Supplements', botId: '1' }
  ],
  paymentMethods: [
    {
      id: '1',
      name: 'Bitcoin',
      type: 'crypto',
      address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      qrCode: '/uploads/bitcoin-qr.png',
      enabled: true,
      botId: '1'
    }
  ],
  shippingOptions: [
    {
      id: '1',
      name: 'Standard Shipping',
      price: 5.99,
      estimatedDays: '5-7',
      botId: '1'
    },
    {
      id: '2',
      name: 'Express Shipping',
      price: 12.99,
      estimatedDays: '2-3',
      botId: '1'
    }
  ],
  broadcasts: [],
  settings: [
    { id: '1', key: 'store_name', value: 'Premium Supplements Store', botId: '1' },
    { id: '2', key: 'support_email', value: 'support@supplements.com', botId: '1' },
    { id: '3', key: 'support_phone', value: '+1-555-0123', botId: '1' }
  ],
  contacts: [
    {
      id: '1',
      name: 'Customer Support',
      email: 'support@supplements.com',
      phone: '+1-555-0123',
      telegram: '@support_bot',
      botId: '1'
    }
  ]
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.redirect('/admin');
});

// Admin dashboard HTML
app.get('/admin', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Telegram Bot Manager</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 20px; text-align: center; }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 3em; font-weight: bold; color: #667eea; margin-bottom: 10px; }
        .stat-label { font-size: 1.1em; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .nav { display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
        .nav-btn { padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; background: #667eea; color: white; font-weight: 500; transition: all 0.3s; }
        .nav-btn:hover { background: #5a6fd8; transform: translateY(-2px); }
        .nav-btn.active { background: #4c63d2; }
        .content { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 16px; transition: border-color 0.3s; }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #667eea; }
        .btn { padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; margin-right: 10px; font-weight: 500; transition: all 0.3s; }
        .btn-primary { background: #667eea; color: white; }
        .btn-primary:hover { background: #5a6fd8; }
        .btn-success { background: #51cf66; color: white; }
        .btn-success:hover { background: #40c057; }
        .btn-danger { background: #ff6b6b; color: white; }
        .btn-danger:hover { background: #ff5252; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .table th, .table td { padding: 15px; text-align: left; border-bottom: 1px solid #e1e5e9; }
        .table th { background: #f8f9fa; font-weight: 600; color: #495057; }
        .table tr:hover { background: #f8f9fa; }
        .login-form { max-width: 400px; margin: 100px auto; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .login-form h2 { text-align: center; margin-bottom: 30px; color: #333; }
        .hidden { display: none; }
        .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: white; padding: 40px; border-radius: 12px; max-width: 500px; width: 90%; box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .modal-content h3 { margin-bottom: 20px; color: #333; }
        .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.9em; font-weight: 500; }
        .status-active { background: #d4edda; color: #155724; }
        .status-inactive { background: #f8d7da; color: #721c24; }
        .empty-state { text-align: center; padding: 60px 20px; color: #666; }
        .empty-state h3 { margin-bottom: 15px; }
        @media (max-width: 768px) {
            .stats { grid-template-columns: 1fr; }
            .nav { flex-direction: column; }
            .container { padding: 10px; }
            .header h1 { font-size: 2em; }
            .stat-number { font-size: 2em; }
        }
    </style>
</head>
<body>
    <div id="app">
        <!-- Login Form -->
        <div v-if="!isAuthenticated" class="login-form">
            <h2>Admin Login</h2>
            <form @submit.prevent="login">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" v-model="loginForm.username" required placeholder="Enter username">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" v-model="loginForm.password" required placeholder="Enter password">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
            </form>
            <p style="text-align: center; margin-top: 20px; color: #666; font-size: 0.9em;">
                Default: admin / admin123
            </p>
        </div>

        <!-- Dashboard -->
        <div v-if="isAuthenticated" class="container">
            <div class="header">
                <h1>Telegram Bot Admin Dashboard</h1>
                <p>Manage your supplement store bot and track performance</p>
            </div>

            <!-- Statistics -->
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">{{ stats.bots }}</div>
                    <div class="stat-label">Active Bots</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ stats.products }}</div>
                    <div class="stat-label">Products</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ stats.users }}</div>
                    <div class="stat-label">Users</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ stats.orders }}</div>
                    <div class="stat-label">Orders</div>
                </div>
            </div>

            <!-- Navigation -->
            <div class="nav">
                <button @click="activeTab = 'bots'" :class="{'nav-btn': true, 'active': activeTab === 'bots'}">Bots</button>
                <button @click="activeTab = 'products'" :class="{'nav-btn': true, 'active': activeTab === 'products'}">Products</button>
                <button @click="activeTab = 'users'" :class="{'nav-btn': true, 'active': activeTab === 'users'}">Users</button>
                <button @click="activeTab = 'orders'" :class="{'nav-btn': true, 'active': activeTab === 'orders'}">Orders</button>
                <button @click="activeTab = 'payments'" :class="{'nav-btn': true, 'active': activeTab === 'payments'}">Payments</button>
                <button @click="activeTab = 'shipping'" :class="{'nav-btn': true, 'active': activeTab === 'shipping'}">Shipping</button>
                <button @click="activeTab = 'broadcasts'" :class="{'nav-btn': true, 'active': activeTab === 'broadcasts'}">Broadcasts</button>
            </div>

            <!-- Content -->
            <div class="content">
                <!-- Bots Tab -->
                <div v-if="activeTab === 'bots'">
                    <h2>Bot Management</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Bot Name</th>
                                <th>Status</th>
                                <th>Token</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="bot in bots" :key="bot.id">
                                <td><strong>@{{ bot.name }}</strong></td>
                                <td>
                                    <span :class="['status-badge', bot.status === 'active' ? 'status-active' : 'status-inactive']">
                                        {{ bot.status }}
                                    </span>
                                </td>
                                <td><code>{{ bot.token.substring(0, 20) }}...</code></td>
                                <td>{{ formatDate(bot.createdAt) }}</td>
                                <td>
                                    <button class="btn btn-primary" @click="editBot(bot)">Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Products Tab -->
                <div v-if="activeTab === 'products'">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2>Product Management</h2>
                        <button class="btn btn-success" @click="showProductForm = true">Add Product</button>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in products" :key="product.id">
                                <td><strong>{{ product.name }}</strong></td>
                                <td>${{ product.price }}</td>
                                <td>{{ product.category }}</td>
                                <td>{{ product.stock }}</td>
                                <td>
                                    <button class="btn btn-primary" @click="editProduct(product)">Edit</button>
                                    <button class="btn btn-danger" @click="deleteProduct(product.id)">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Users Tab -->
                <div v-if="activeTab === 'users'">
                    <h2>User Management</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Full Name</th>
                                <th>Last Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users" :key="user.id">
                                <td><strong>@{{ user.username }}</strong></td>
                                <td>{{ user.firstName }} {{ user.lastName }}</td>
                                <td>{{ formatDate(user.lastActive) }}</td>
                                <td>
                                    <button class="btn btn-primary">View Details</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Orders Tab -->
                <div v-if="activeTab === 'orders'">
                    <h2>Order Management</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in orders" :key="order.id">
                                <td><strong>#{{ order.id }}</strong></td>
                                <td>{{ getUserName(order.userId) }}</td>
                                <td><strong>${{ order.total }}</strong></td>
                                <td>
                                    <span :class="['status-badge', order.status === 'completed' ? 'status-active' : 'status-inactive']">
                                        {{ order.status }}
                                    </span>
                                </td>
                                <td>{{ formatDate(order.createdAt) }}</td>
                                <td>
                                    <button class="btn btn-primary">View Details</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Payments Tab -->
                <div v-if="activeTab === 'payments'">
                    <h2>Payment Methods</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Payment Method</th>
                                <th>Type</th>
                                <th>Address/Details</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="payment in paymentMethods" :key="payment.id">
                                <td><strong>{{ payment.name }}</strong></td>
                                <td>{{ payment.type }}</td>
                                <td><code>{{ payment.address }}</code></td>
                                <td>
                                    <span :class="['status-badge', payment.enabled ? 'status-active' : 'status-inactive']">
                                        {{ payment.enabled ? 'Enabled' : 'Disabled' }}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-primary">Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Shipping Tab -->
                <div v-if="activeTab === 'shipping'">
                    <h2>Shipping Options</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Shipping Method</th>
                                <th>Price</th>
                                <th>Estimated Delivery</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="shipping in shippingOptions" :key="shipping.id">
                                <td><strong>{{ shipping.name }}</strong></td>
                                <td>${{ shipping.price }}</td>
                                <td>{{ shipping.estimatedDays }} days</td>
                                <td>
                                    <button class="btn btn-primary">Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Broadcasts Tab -->
                <div v-if="activeTab === 'broadcasts'">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2>Broadcast Messages</h2>
                        <button class="btn btn-success" @click="showBroadcastForm = true">Send Broadcast</button>
                    </div>
                    <div v-if="broadcasts.length === 0" class="empty-state">
                        <h3>No broadcasts sent yet</h3>
                        <p>Send your first message to all {{ stats.users }} users!</p>
                    </div>
                    <table v-else class="table">
                        <thead>
                            <tr>
                                <th>Message</th>
                                <th>Sent</th>
                                <th>Recipients</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="broadcast in broadcasts" :key="broadcast.id">
                                <td>{{ broadcast.message }}</td>
                                <td>{{ formatDate(broadcast.sentAt) }}</td>
                                <td>{{ broadcast.recipients }}</td>
                                <td>{{ broadcast.status }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Product Form Modal -->
        <div v-if="showProductForm" class="modal" @click="closeModal">
            <div class="modal-content" @click.stop>
                <h3>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h3>
                <form @submit.prevent="saveProduct">
                    <div class="form-group">
                        <label>Product Name</label>
                        <input type="text" v-model="productForm.name" required placeholder="Enter product name">
                    </div>
                    <div class="form-group">
                        <label>Price ($)</label>
                        <input type="number" step="0.01" v-model="productForm.price" required placeholder="0.00">
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select v-model="productForm.category" required>
                            <option value="">Select category</option>
                            <option value="Protein Powders">Protein Powders</option>
                            <option value="Supplements">Supplements</option>
                            <option value="Pre-Workout">Pre-Workout</option>
                            <option value="Vitamins">Vitamins</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Stock Quantity</label>
                        <input type="number" v-model="productForm.stock" required placeholder="0">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea v-model="productForm.description" rows="3" required placeholder="Enter product description"></textarea>
                    </div>
                    <div style="text-align: right; margin-top: 30px;">
                        <button type="button" class="btn" @click="closeModal">Cancel</button>
                        <button type="submit" class="btn btn-success">{{ editingProduct ? 'Update' : 'Add' }} Product</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Broadcast Form Modal -->
        <div v-if="showBroadcastForm" class="modal" @click="closeModal">
            <div class="modal-content" @click.stop>
                <h3>Send Broadcast Message</h3>
                <form @submit.prevent="sendBroadcast">
                    <div class="form-group">
                        <label>Message</label>
                        <textarea v-model="broadcastForm.message" rows="4" required placeholder="Enter your message to all users..."></textarea>
                    </div>
                    <div style="text-align: right; margin-top: 30px;">
                        <button type="button" class="btn" @click="closeModal">Cancel</button>
                        <button type="submit" class="btn btn-success">Send to {{ stats.users }} Users</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        const { createApp } = Vue;
        
        createApp({
            data() {
                return {
                    isAuthenticated: false,
                    activeTab: 'bots',
                    loginForm: { username: '', password: '' },
                    stats: { bots: 1, products: 2, users: 2, orders: 1 },
                    bots: [],
                    products: [],
                    users: [],
                    orders: [],
                    paymentMethods: [],
                    shippingOptions: [],
                    broadcasts: [],
                    showProductForm: false,
                    showBroadcastForm: false,
                    editingProduct: null,
                    productForm: { name: '', price: '', category: '', stock: '', description: '' },
                    broadcastForm: { message: '' }
                };
            },
            mounted() {
                // Check if already authenticated
                const token = localStorage.getItem('adminToken');
                if (token === 'admin123') {
                    this.isAuthenticated = true;
                    this.loadData();
                }
            },
            methods: {
                login() {
                    if (this.loginForm.username === 'admin' && this.loginForm.password === 'admin123') {
                        this.isAuthenticated = true;
                        localStorage.setItem('adminToken', 'admin123');
                        this.loadData();
                    } else {
                        alert('Invalid credentials. Use: admin / admin123');
                    }
                },
                async loadData() {
                    try {
                        const response = await fetch('/api/dashboard-data');
                        const data = await response.json();
                        this.bots = data.bots;
                        this.products = data.products;
                        this.users = data.users;
                        this.orders = data.orders;
                        this.paymentMethods = data.paymentMethods;
                        this.shippingOptions = data.shippingOptions;
                        this.broadcasts = data.broadcasts;
                        this.updateStats();
                    } catch (error) {
                        console.error('Error loading data:', error);
                    }
                },
                updateStats() {
                    this.stats = {
                        bots: this.bots.length,
                        products: this.products.length,
                        users: this.users.length,
                        orders: this.orders.length
                    };
                },
                editBot(bot) {
                    alert('Bot configuration: ' + bot.name + ' is active and running!');
                },
                editProduct(product) {
                    this.editingProduct = product;
                    this.productForm = { ...product };
                    this.showProductForm = true;
                },
                saveProduct() {
                    if (this.editingProduct) {
                        const index = this.products.findIndex(p => p.id === this.editingProduct.id);
                        this.products[index] = { ...this.productForm };
                        alert('Product updated successfully!');
                    } else {
                        const newProduct = {
                            id: Date.now().toString(),
                            ...this.productForm,
                            botId: '1'
                        };
                        this.products.push(newProduct);
                        alert('Product added successfully!');
                    }
                    this.updateStats();
                    this.closeModal();
                },
                deleteProduct(productId) {
                    if (confirm('Are you sure you want to delete this product?')) {
                        this.products = this.products.filter(p => p.id !== productId);
                        this.updateStats();
                        alert('Product deleted successfully!');
                    }
                },
                sendBroadcast() {
                    const newBroadcast = {
                        id: Date.now().toString(),
                        message: this.broadcastForm.message,
                        sentAt: new Date().toISOString(),
                        recipients: this.users.length,
                        status: 'sent'
                    };
                    this.broadcasts.push(newBroadcast);
                    alert('Broadcast sent to ' + this.users.length + ' users!');
                    this.closeModal();
                },
                closeModal() {
                    this.showProductForm = false;
                    this.showBroadcastForm = false;
                    this.editingProduct = null;
                    this.productForm = { name: '', price: '', category: '', stock: '', description: '' };
                    this.broadcastForm = { message: '' };
                },
                formatDate(dateString) {
                    return new Date(dateString).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                },
                getUserName(userId) {
                    const user = this.users.find(u => u.id === userId);
                    return user ? user.firstName + ' ' + user.lastName : 'Unknown User';
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
  `);
});

// API Routes
app.get('/api/dashboard-data', (req, res) => {
  res.json(dashboardData);
});

app.post('/api/products', upload.single('image'), (req, res) => {
  const newProduct = {
    id: Date.now().toString(),
    ...req.body,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    botId: '1'
  };
  dashboardData.products.push(newProduct);
  res.json(newProduct);
});

app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const productId = req.params.id;
  const index = dashboardData.products.findIndex(p => p.id === productId);
  if (index !== -1) {
    dashboardData.products[index] = {
      ...dashboardData.products[index],
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : dashboardData.products[index].image
    };
    res.json(dashboardData.products[index]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  dashboardData.products = dashboardData.products.filter(p => p.id !== productId);
  res.json({ success: true });
});

app.post('/api/broadcasts', (req, res) => {
  const newBroadcast = {
    id: Date.now().toString(),
    ...req.body,
    sentAt: new Date().toISOString(),
    recipients: dashboardData.users.length,
    status: 'sent'
  };
  dashboardData.broadcasts.push(newBroadcast);
  res.json(newBroadcast);
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Admin Dashboard Server running on port ${PORT}`);
  console.log(`📊 Admin dashboard: http://localhost:${PORT}/admin`);
  console.log(`🔑 Login: admin / admin123`);
  console.log(`📈 Current data: ${dashboardData.bots.length} bots, ${dashboardData.products.length} products, ${dashboardData.users.length} users`);
});

module.exports = app;