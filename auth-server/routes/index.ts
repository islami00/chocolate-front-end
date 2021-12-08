import passport from 'passport';
import express from 'express';
import { registerPostController } from '../controllers/UserControllers';
const router = express.Router();

/**
 * -------------- POST ROUTES ----------------
 */

// TODO

router.post('/login', passport.authenticate('local'), (req, res, next) => {});

router.post('/register', registerPostController);

/**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', (req, res, next) => {
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  if (req.isAuthenticated()) {
    res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
  } else {
    res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
  }
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get('/login-failure', (req, res, next) => {
  res.send('You entered the wrong password.');
});

export default router;
