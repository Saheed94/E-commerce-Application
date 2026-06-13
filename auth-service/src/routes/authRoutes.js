const express =
  require('express');

const router = express.Router();

const {
  register,
  login,
  profile,
  logout
} = require(
  '../controllers/authController'
);

const authMiddleware =
  require(
    '../middleware/authMiddleware'
  );

router.post(
  '/register',
  register
);

router.post('/login', login);

router.get(
  '/profile',
  authMiddleware,
  profile
);

router.post(
  '/logout',
  authMiddleware,
  logout
);

module.exports = router;