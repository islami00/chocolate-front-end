import express from 'express';

const router = express.Router();
// session is optional
type customReq = express.Request & { session?: { viewCount?: number } };
export const sessionTestRouteMatcher: express.RequestHandler = (req: customReq, res, next) => {
  if (!req.session) {
    res.json({ error: 'no session' });
    return;
  }
  if (req.session.viewCount) {
    req.session.viewCount++;
  } else {
    req.session.viewCount = 1;
  }
  res.json({ viewCount: req.session.viewCount });
  next();
};
/* GET session test. */
router.get('/session-example', sessionTestRouteMatcher);

export default router;
