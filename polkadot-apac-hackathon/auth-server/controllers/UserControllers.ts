// register. Interface and fx
import express, { Request, RequestHandler } from 'express';
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
interface ApiErr {
  error?: string;
}
/** Only allow alphanumerics with underscores and dashes used as word separators. No dots. Max len 20chars.*/
const isUsername = function (uname: string) {
  
  return (
    validator.isLength(uname, { max: 30, min: 1 }) &&
    validator.matches(uname, /^[A-Za-z][A-Za-z0-9]*(?:(_*|-*)[A-Za-z0-9]+)*$/)
  );
};
/**
 *  Creates middleware that escapes specific fields
 * ToDo: Move sanitisation to expressValidator */
export const sanitiseBodyFields = function(fields: string[]){
  return function(req,res,next){
    // Sanitise for dom
    fields.forEach((field)=>req.body[field] = validator.escape(field))
    // Sanitise for db.
    next();
  } as RequestHandler
}

export const registerPostValidator: RegisterRequestHandler = async function (
  req: RegisterRequest,
  res,
  next
) {
  if (!req.body.web3Address) {
    res.status(400).json({ error: 'invalid w3 address' });
    return;
  }
  if (typeof req.body.ps !== 'string' || !req.body.ps) {
    res.status(400).json({ error: 'invalid password' });
    return;
  }
  if (typeof req.body.uname !== 'string') {
    res.status(400).json({ error: 'invalid username' });
    return;
  }
  // validate only username. Prefer passwordless.
  const web3Address = req.body.web3Address;
  const uname = req.body.uname;
  const ps = req.body.ps;
  // Re: https://stackoverflow.com/questions/1330693/validate-username-as-alphanumeric-with-underscores
  const validUname = isUsername(uname);
  // Ensure web3add and name are not jsons
  if (!validUname) {
    res.status(400);
    res.json({ error: 'Invalid username' });
    return;
  }
  next();
};
export const registerPostController: RegisterRequestHandler = async (
  req: RegisterRequest,
  res,
  next
) => {
  // Confident that these exist.
  const { web3Address, uname, ps } = req.body;

  const _User = await UserPromise;
  const user = await _User.findOne({ profile: { username: uname } });
  const userW3 = await _User.findOne({ web3Address: web3Address });
  if (user || userW3) {
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

  const savedUser = await errorHandled(newUser.save());
  if (savedUser[1]) {
    // Handle via errback
    res.status(500).json({
      error: 'Error saving user',
    });
    return next(savedUser[1]);
  }
  res.json({
    success: true,
  });
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
    publicKey: user?.web3Address,
  });
};
