import passport from 'passport';
import express from 'express';
import { loginPostController, registerPostController } from '../controllers/UserControllers';
const router = express.Router();

// https://expressjs.com/en/guide/error-handling.html
const errorHandler: express.ErrorRequestHandler = function (err, req, res, next) {
  // log it
  console.error(err.stack);
  console.error(err.message);
  // respond with 500 "Internal Server Error", instead of default stack trace
  res.status(500);
  res.json(err.stack);
};;
const isAuthHandler: express.RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401);
  res.json({
    message: 'Unauthorized',
  });
};

router.post('/login', passport.authenticate('local'), loginPostController);

router.post('/register', registerPostController);
router.get('/auth/check', isAuthHandler,(req,res,next)=>{
  res.json({
    success: true,
    user: {
      publicKey: req.user?.web3Address
    }
  });
  next();
});
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
router.use(errorHandler)
export default router;
