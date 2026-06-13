require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

const PORT =
  process.env.PORT || 3003;

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    service:
      'notification-service',
    status: 'healthy'
  });
});

// Mock Notification
app.post(
  '/api/notifications/send',
  async (req, res) => {
    try {
      const {
        email,
        message
      } = req.body;

      console.log(
        `
📧 Notification Sent
To: ${email}
Message: ${message}
        `
      );

      res.json({
        success: true,
        message:
          'Notification sent'
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Notification failed'
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(
    `Notification Service running on port ${PORT}`
  );
});