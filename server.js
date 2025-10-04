// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// In-memory database (simulating a real database)
const payments = [];
const products = [
  { id: 1, name: 'Laptop', price: 999.99, stock: 10 },
  { id: 2, name: 'Smartphone', price: 599.99, stock: 25 },
  { id: 3, name: 'Headphones', price: 149.99, stock: 50 },
  { id: 4, name: 'Keyboard', price: 79.99, stock: 30 },
  { id: 5, name: 'Mouse', price: 49.99, stock: 40 }
];

// Payment processing simulator
function processPayment(paymentData) {
  // Simulate payment gateway delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 95% success rate
      const success = Math.random() > 0.05;
      resolve({
        success,
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message: success ? 'Payment processed successfully' : 'Payment failed'
      });
    }, 1000);
  });
}

// Validate payment data
function validatePayment(data) {
  const errors = [];
  
  if (!data.amount || data.amount <= 0) {
    errors.push('Invalid amount');
  }
  
  if (!data.cardNumber || data.cardNumber.length !== 16) {
    errors.push('Invalid card number');
  }
  
  if (!data.cvv || data.cvv.length !== 3) {
    errors.push('Invalid CVV');
  }
  
  if (!data.expiryDate || !/^\d{2}\/\d{2}$/.test(data.expiryDate)) {
    errors.push('Invalid expiry date format (MM/YY)');
  }
  
  return errors;
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: products
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

// Create payment
app.post('/api/payments', async (req, res) => {
  try {
    const { productId, quantity, cardNumber, cvv, expiryDate, email } = req.body;
    
    // Find product
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }
    
    // Calculate amount
    const amount = product.price * quantity;
    
    // Validate payment data
    const validationErrors = validatePayment({
      amount,
      cardNumber,
      cvv,
      expiryDate
    });
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }
    
    // Process payment
    const paymentResult = await processPayment({
      amount,
      cardNumber,
      cvv,
      expiryDate
    });
    
    if (!paymentResult.success) {
      return res.status(402).json({
        success: false,
        message: paymentResult.message
      });
    }
    
    // Update stock
    product.stock -= quantity;
    
    // Store payment record
    const payment = {
      id: payments.length + 1,
      transactionId: paymentResult.transactionId,
      productId: product.id,
      productName: product.name,
      quantity,
      amount,
      email,
      status: 'completed',
      timestamp: new Date().toISOString()
    };
    
    payments.push(payment);
    
    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      data: payment
    });
    
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all payments
app.get('/api/payments', (req, res) => {
  res.json({
    success: true,
    data: payments
  });
});

// Get payment by transaction ID
app.get('/api/payments/:transactionId', (req, res) => {
  const payment = payments.find(p => p.transactionId === req.params.transactionId);
  
  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }
  
  res.json({
    success: true,
    data: payment
  });
});

// Refund payment
app.post('/api/payments/:transactionId/refund', (req, res) => {
  const payment = payments.find(p => p.transactionId === req.params.transactionId);
  
  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }
  
  if (payment.status === 'refunded') {
    return res.status(400).json({
      success: false,
      message: 'Payment already refunded'
    });
  }
  
  // Update payment status
  payment.status = 'refunded';
  payment.refundedAt = new Date().toISOString();
  
  // Restore stock
  const product = products.find(p => p.id === payment.productId);
  if (product) {
    product.stock += payment.quantity;
  }
  
  res.json({
    success: true,
    message: 'Refund processed successfully',
    data: payment
  });
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 E-Commerce Payment API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`💳 Payments: http://localhost:${PORT}/api/payments`);
});

module.exports = app;