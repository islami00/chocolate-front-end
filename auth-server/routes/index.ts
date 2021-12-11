import passport from 'passport';
import express from 'express';
import { loginPostController, registerPostController } from '../controllers/UserControllers';
const router = express.Router();

const isAuthHandler: express.RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    message: 'Unauthorized',
  });
};

router.post('/login', passport.authenticate('local'), loginPostController);

router.post('/register', registerPostController);

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});
router.get('/protected', isAuthHandler, (req, res, next) => {
  res.json({
    message: 'This is a protected route',
  });
});

export default router;
