import bcrypt from 'bcrypt';
import crypto from 'crypto';
import mongoose, { Document, Types } from 'mongoose';
import type { Model } from 'mongoose';
import { connection as db } from '../config/sessionconfig';
const schemaDoc = {
  passwordHash: String,

  passwordResetToken: String,
  passwordResetExpires: Date,

  web3Address: { type: String, unique: true },
  web3nonce: Number,

  tokens: Array,

  profile: {
    username: { type: String, unique: true },
  },
};

interface UserTypeInterface {
  passwordHash: string;

  passwordResetToken: string;
  passwordResetExpires: Date;

  web3Address: string;
  web3nonce: number;

  tokens: Array<any>;

  profile: {
    username: string;
  };
  validatePassword(
    candidatePassword: string,
    cb: (err: Error | null, same?: boolean | UserBaseDocument) => void
  ): void;
  gravatar(size: number): string;
}
// interfaces
export interface UserBaseDocument extends UserTypeInterface, Document {
  tokens: Types.Array<any>;
}
// For model
export interface UserModel extends Model<UserBaseDocument> {}

const userSchema = new mongoose.Schema<UserTypeInterface>(schemaDoc, { timestamps: true });

/**
 * Password hash middleware.
 * This sets up our user to hash password with salt before create and modification actions on
 * passwordhash -> implicit on user doc.
 * i.e only hash the password if it has been modified (or is new). Should work mostly for
 * account changes. No account system fn though.
 */
userSchema.pre<UserBaseDocument>('save', function save(next) {
  const user = this;
  if (!user.isModified('passwordHash')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.passwordHash, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.passwordHash = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's passwordHash. Calls passport done method.
 * Why there's no salt: https://stackoverflow.com/a/277057/16071410
 */
userSchema.methods.validatePassword = function (this: UserBaseDocument, candidatePassword, done) {
  bcrypt.compare(candidatePassword, this.passwordHash, (err, isMatch) => {
    if (err) {
      return done(err);
    }
    if (!isMatch) {
      return done(null, false);
    }
    done(null, this);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(this: UserBaseDocument, size) {
  if (!size) {
    size = 200;
  }
  if (!this.web3Address) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }

  return `https://gravatar.com/avatar/${this.web3Address}?s=${size}&d=retro`;
};

// ref:https://stackoverflow.com/questions/12806559/mongoose-model-vs-connection-model-vs-model-model
const User = db.model<UserBaseDocument, UserModel>('User', userSchema);
// connected user model to db
export default User;
