require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');

const app = express();

const PORT =
  process.env.PORT || 3102;

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Mock Database
const orders = [];

const products = [
  {
    id: 1,
    name: 'Laptop',
    price: 899.99,
    stock: 10
  },
  {
    id: 2,
    name: 'Smartphone',
    price: 499.99,
    stock: 25
  },
  {
    id: 3,
    name: 'Headphones',
    price: 149.99,
    stock: 50
  }
];

// Health
app.get('/health', (req, res) => {
  res.json({
    service: 'orders-service',
    status: 'healthy'
  });
});

// Products
app.get(
  '/api/orders/products',
  (req, res) => {
    res.json({
      success: true,
      data: products
    });
  }
);

// Create Order
app.post(
  '/api/orders/checkout',
  async (req, res) => {
    try {
      const {
        productId,
        quantity,
        email
      } = req.body;

      const product =
        products.find(
          p =>
            p.id ===
            parseInt(productId)
        );

      if (!product) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              'Product not found'
          });
      }

      if (
        product.stock < quantity
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'Insufficient stock'
          });
      }

      product.stock -= quantity;

      const order = {
        id: `ORD-${Date.now()}`,
        productId:
          product.id,
        productName:
          product.name,
        quantity,
        amount:
          product.price *
          quantity,
        email,
        status:
          'completed',
        createdAt:
          new Date().toISOString()
      };

      orders.push(order);

      // Call Notification Service
      try {
        await axios.post(
          `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications/send`,
          {
            email,
            message: `Order confirmed for ${product.name}`
          }
        );
      } catch (error) {
        console.error(
          'Notification failed'
        );
      }

      res.status(201).json({
        success: true,
        message:
          'Order created',
        data: order
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Internal Server Error'
      });
    }
  }
);

// Get Orders
app.get(
  '/api/orders',
  (req, res) => {
    res.json({
      success: true,
      data: orders
    });
  }
);

// Refund Order
app.post(
  '/api/orders/:id/refund',
  (req, res) => {
    const order =
      orders.find(
        o =>
          o.id ===
          req.params.id
      );

    if (!order) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            'Order not found'
        });
    }

    order.status =
      'refunded';

    res.json({
      success: true,
      message:
        'Refund successful',
      data: order
    });
  }
);

app.listen(PORT, () => {
  console.log(
    `Orders Service running on port ${PORT}`
  );
});








// // server.js
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(helmet({
//   contentSecurityPolicy: false, // Allow inline scripts for our frontend
// }));
// app.use(cors());
// app.use(express.json());
// app.use(morgan('dev'));

// // In-memory database (simulating a real database)
// const payments = [];
// const products = [
//   { id: 1, name: 'Laptop', price: 899.99, stock: 10, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
//   { id: 2, name: 'Smartphone', price: 499.99, stock: 25, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
//   { id: 3, name: 'Headphones', price: 149.99, stock: 50, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
//   { id: 4, name: 'Keyboard', price: 79.99, stock: 30, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400' },
//   { id: 5, name: 'Mouse', price: 49.99, stock: 40, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400' }
// ];

// // Payment processing simulator
// function processPayment(paymentData) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const success = Math.random() > 0.05;
//       resolve({
//         success,
//         transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//         message: success ? 'Payment processed successfully' : 'Payment failed'
//       });
//     }, 1000);
//   });
// }

// // Validate payment data
// function validatePayment(data) {
//   const errors = [];
  
//   if (!data.amount || data.amount <= 0) {
//     errors.push('Invalid amount');
//   }
  
//   if (!data.cardNumber || data.cardNumber.length !== 16) {
//     errors.push('Invalid card number');
//   }
  
//   if (!data.cvv || data.cvv.length !== 3) {
//     errors.push('Invalid CVV');
//   }
  
//   if (!data.expiryDate || !/^\d{2}\/\d{2}$/.test(data.expiryDate)) {
//     errors.push('Invalid expiry date format (MM/YY)');
//   }
  
//   return errors;
// }

// // API Routes (MUST come before static files!)

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'healthy',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime()
//   });
// });

// // Get all products
// app.get('/api/products', (req, res) => {
//   res.json({
//     success: true,
//     data: products
//   });
// });

// // Get single product
// app.get('/api/products/:id', (req, res) => {
//   const product = products.find(p => p.id === parseInt(req.params.id));
  
//   if (!product) {
//     return res.status(404).json({
//       success: false,
//       message: 'Product not found'
//     });
//   }
  
//   res.json({
//     success: true,
//     data: product
//   });
// });

// // Create payment
// app.post('/api/payments', async (req, res) => {
//   try {
//     const { productId, quantity, cardNumber, cvv, expiryDate, email } = req.body;
    
//     const product = products.find(p => p.id === parseInt(productId));
    
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }
    
//     if (product.stock < quantity) {
//       return res.status(400).json({
//         success: false,
//         message: 'Insufficient stock'
//       });
//     }
    
//     const amount = product.price * quantity;
    
//     const validationErrors = validatePayment({
//       amount,
//       cardNumber,
//       cvv,
//       expiryDate
//     });
    
//     if (validationErrors.length > 0) {
//       return res.status(400).json({
//         success: false,
//         errors: validationErrors
//       });
//     }
    
//     const paymentResult = await processPayment({
//       amount,
//       cardNumber,
//       cvv,
//       expiryDate
//     });
    
//     if (!paymentResult.success) {
//       return res.status(402).json({
//         success: false,
//         message: paymentResult.message
//       });
//     }
    
//     product.stock -= quantity;
    
//     const payment = {
//       id: payments.length + 1,
//       transactionId: paymentResult.transactionId,
//       productId: product.id,
//       productName: product.name,
//       quantity,
//       amount,
//       email,
//       status: 'completed',
//       timestamp: new Date().toISOString()
//     };
    
//     payments.push(payment);
    
//     res.status(201).json({
//       success: true,
//       message: 'Payment processed successfully',
//       data: payment
//     });
    
//   } catch (error) {
//     console.error('Payment error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// });

// // Get all payments
// app.get('/api/payments', (req, res) => {
//   res.json({
//     success: true,
//     data: payments
//   });
// });

// // Get payment by transaction ID
// app.get('/api/payments/:transactionId', (req, res) => {
//   const payment = payments.find(p => p.transactionId === req.params.transactionId);
  
//   if (!payment) {
//     return res.status(404).json({
//       success: false,
//       message: 'Payment not found'
//     });
//   }
  
//   res.json({
//     success: true,
//     data: payment
//   });
// });

// // Refund payment
// app.post('/api/payments/:transactionId/refund', (req, res) => {
//   const payment = payments.find(p => p.transactionId === req.params.transactionId);
  
//   if (!payment) {
//     return res.status(404).json({
//       success: false,
//       message: 'Payment not found'
//     });
//   }
  
//   if (payment.status === 'refunded') {
//     return res.status(400).json({
//       success: false,
//       message: 'Payment already refunded'
//     });
//   }
  
//   payment.status = 'refunded';
//   payment.refundedAt = new Date().toISOString();
  
//   const product = products.find(p => p.id === payment.productId);
//   if (product) {
//     product.stock += payment.quantity;
//   }
  
//   res.json({
//     success: true,
//     message: 'Refund processed successfully',
//     data: payment
//   });
// });

// // Serve static frontend files (AFTER API routes!)
// app.use(express.static(path.join(__dirname, 'public')));

// // Serve index.html for the root route or any unmatched route (SPA support)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Something went wrong!'
//   });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 E-Commerce Payment API running on port ${PORT}`);
//   console.log(`📍 Frontend: http://localhost:${PORT}`);
//   console.log(`📍 Health check: http://localhost:${PORT}/health`);
//   console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
//   console.log(`💳 Payments API: http://localhost:${PORT}/api/payments`);
// });

// module.exports = app;