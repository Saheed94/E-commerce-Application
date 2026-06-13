require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./src/config/db');
const connectRedis = require('./src/config/redis');

const authRoutes = require('./src/routes/authRoutes');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({
    service: 'auth-service',
    status: 'healthy'
  });
});

app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(
        `Auth Service running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();