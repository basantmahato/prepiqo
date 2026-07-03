import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String
    // Not required anymore because Google users don't have passwords
  },
  googleId: {
    type: String,
    default: null
  },
  profilePicture: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  currentSubscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  pendingNewEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  emailChangeOtp: String,
  emailChangeOtpExpire: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationOtp: String,
  verificationOtpExpire: Date
}, { timestamps: true });

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Generate and hash email change OTP
userSchema.methods.getEmailChangeOtp = function() {
  // Generate 6-digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP
  this.emailChangeOtp = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  // Set expire to 15 mins
  this.emailChangeOtpExpire = Date.now() + 15 * 60 * 1000;

  return otp; // Return raw OTP to send via email
};

// Generate and hash account verification OTP
userSchema.methods.getVerificationOtp = function() {
  // Generate 6-digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP
  this.verificationOtp = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  // Set expire to 15 mins
  this.verificationOtpExpire = Date.now() + 15 * 60 * 1000;

  return otp; // Return raw OTP to send via email
};

export const User = mongoose.model('User', userSchema);
