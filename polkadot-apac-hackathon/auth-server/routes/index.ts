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
  // Extended err for client to log.
  res.json({error: 'Something went wrong processing your request on the server, please try again later'});
};;
const isAuthHandler: express.RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401);
  // Review this code and message in places with fine-grained access control
  res.json({
    error: 'Unauthorized',
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
router.post('/logout', (req, res, next) => {
  // https://github.com/jaredhanson/passport/issues/246
  req.logout();
  req.session?.destroy((err)=>{
    if(err) return next(err);
    res.json({success: true});
  });
});
router.get('/protected', isAuthHandler, (req, res, next) => {
  res.json({
    message: 'This is a protected route',
  });
});
router.use(errorHandler)
export default router;
