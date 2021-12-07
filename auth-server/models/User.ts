import bcrypt from 'bcrypt';
import crypto from 'crypto';
import mongoose, { Document, Model, Mongoose, Schema, Types } from 'mongoose';
const schemaDoc = {
  email: { type: String, unique: true },
  passwordHash: String,
  passwordSalt: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerified: Boolean,

  web3Address: String,
  web3nonce: Number,

  tokens: Array,

  profile: {
    username: { type: String, unique: true },
  },
};

interface UserTypeInterface {
  email: string;
  passwordHash: string;
  passwordSalt: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  emailVerificationToken: string;
  emailVerified: boolean;

  web3Address: string;
  web3nonce: number;

  tokens: Array<any>;

  profile: {
    username: string;
  };
  validatePassword(
    candidatePassword: string,
    cb: (err: Error | undefined, same: boolean) => any
  ): void;
  gravatar(size: number): string;
}
// interfaces
interface UserBaseDocument extends UserTypeInterface, Document {
  tokens: Types.Array<any>;
}
// For model
export interface UserModel extends Model<UserBaseDocument> {
  findByToken(token: string): Promise<UserBaseDocument>;
}

const userSchema = new mongoose.Schema<UserTypeInterface>(schemaDoc, { timestamps: true });

/**
 * Password hash middleware. This sets up our user to hash with salt before anything. Edit when you start express thingies
 */
// this is where we'll place create password 
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
 * Helper method for validating user's passwordHash.
 */
userSchema.methods.validatePassword = function validatePassword(
  this: UserBaseDocument,
  candidatePassword: string,
  cb
) {
  bcrypt.compare(candidatePassword, this.passwordHash, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(this: UserBaseDocument, size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model<UserBaseDocument, UserModel>('User', userSchema);

export default User;
