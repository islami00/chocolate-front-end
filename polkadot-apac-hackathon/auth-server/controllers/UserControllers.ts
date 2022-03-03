// register. Interface and fx
import express from 'express';
import validator from 'validator';
import { UserPromise } from '../models/User';
import { errorHandled } from '../utils/regUtils';
/**
 * Post: /register.
 * Move to: /api/user/register
 */
interface RegisterRequest extends express.Request {
  body: {
    uname: string;
    ps: string;
    web3Address: string;
  };
}
interface RegisterRequestHandler extends express.RequestHandler {
  (req: RegisterRequest, res: express.Response, next: express.NextFunction): Promise<void>;
}
export const registerPostController: RegisterRequestHandler = async (
  req: RegisterRequest,
  res,
  next
) => {
  if (typeof req.body.ps !== 'string') {
    res.status(400).send('invalid password');
    return;
  }
  // validate first - input then user struct
  const web3Address = req.body.web3Address;
  const uname = req.body.uname;
  const ps = req.body.ps;

  const validUname = validator.isAlphanumeric(uname);
  if (!validUname) {
     res.status(400);
     res.json('Invalid username');
     return;
  }
  // Hopefully express catches this.
  const _User = await UserPromise;
  const user = await _User.findOne({ profile: { username: uname } });
  const userW3 = await _User.findOne({ web3Address: web3Address });
  if (user || userW3) {
    // This isn't a server error
    const msg = `${user ? 'Username' : 'web3Address'} already exists`;
     res.status(400);
    res.json({
      error: msg,
    });
    return;
  }
  // hook hashes for us
  const newUser = new _User({
    profile: { username: uname },
    passwordHash: ps,
    web3Address: web3Address,
  });

  const [savedUser, err] = await errorHandled(newUser.save());
  if (err) {
    // Handle via errback
    res.status(500).json({
      error: 'Error saving user',
    });
    return next(err);
  }
  if (savedUser) {
    res.json({
      success: true,
    });
  }
  return next();
};
/**
 * Post: /login --when authed
 * MoveTo: /api/user/login
 */
export const loginPostController: express.RequestHandler = (req, res, next) => {
  const user = req.user;
  res.json({
    success: true,
    publicKey: user?.web3Address
  });
 
};