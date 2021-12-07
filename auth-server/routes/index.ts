import express from 'express';

const router = express.Router();

type customReq = express.Request & { session: { viewCount?: number } };

/* GET session test. */
router.get('/session-test', (req: customReq, res, next) => {
  if (req.session.viewCount) req.session.viewCount++;
  else req.session.viewCount = 1;
  res.json({
    message: `${req.session.viewCount}HelWorld!`,
  });
});

export default router;
