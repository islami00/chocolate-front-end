// register. Interface and fx
import express from 'express';
import User from '../models/User';

/**
 * Post: /register.
 * Move to: /api/users/register
 */
interface RegisterRequest extends express.Request {
  body: {
    uname: string;
    pw: string;
    web3Address: string;
  };
}
interface RegisterRequestHandler extends express.RequestHandler {
  (req: RegisterRequest, res: express.Response, next: express.NextFunction): Promise<void>;
}
export const registerPostController: RegisterRequestHandler = async (req, res, next) => {
  // validate first - input then user struct
  const web3Address = req.body.web3Address;
  const uname = req.body.uname;
  const pw = req.body.pw;

  const user = await User.findOne({ web3Address });
  if (user) {
    const userError = new Error('User already exists');
    res.status(400).json({
      error: 'User already exists',
    });

    return next();
  }
  // hook hashes for us
  const newUser = new User({
    profile: { username: uname },
    passwordHash: pw,
    web3Address: web3Address,
  });

  const savedUser = await newUser.save().catch((err) => {
    console.error(err);
    return res.status(400).json({
      error: 'Error saving user',
    });
  });
  if (savedUser) {
    res.json({
      success: true,
    });
  }
  return next();
};
