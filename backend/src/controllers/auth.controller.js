import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      if (!userExists.isVerified) {
        // If they exist but aren't verified, we can resend the OTP instead of blocking completely
        const otp = userExists.getVerificationOtp();
        await userExists.save();

        await sendEmail({
          email: userExists.email,
          subject: 'Verify your MCQ Bot account',
          message: `Hi ${userExists.name},\n\nYour verification code is: ${otp}\n\nThis code expires in 15 minutes.`,
          htmlMessage: `<h3>Hi ${userExists.name},</h3><p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 15 minutes.</p>`,
        });
        
        return res.status(200).json({
          requiresVerification: true,
          email: userExists.email,
          message: 'Account exists but is not verified. A new OTP has been sent to your email.'
        });
      }
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (isVerified will default to false)
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const otp = user.getVerificationOtp();
    await user.save();

    // Send verification email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify your MCQ Bot account',
        message: `Hi ${user.name},\n\nWelcome to MCQ Bot! Your verification code is: ${otp}\n\nThis code expires in 15 minutes.`,
        htmlMessage: `<h3>Hi ${user.name},</h3><p>Welcome to MCQ Bot! Your verification code is: <strong>${otp}</strong></p><p>This code expires in 15 minutes.</p>`,
      });

      res.status(201).json({
        requiresVerification: true,
        email: user.email,
        message: 'Registration successful! Please check your email for the verification code.',
      });
    } catch (err) {
      console.error("Error sending OTP on register:", err);
      // Remove user if we couldn't send the email
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ message: 'Could not send verification email. Please try again.' });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).populate('currentSubscription');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
       // Send another OTP automatically to help them verify
       const otp = user.getVerificationOtp();
       await user.save();
       try {
         await sendEmail({
           email: user.email,
           subject: 'Verify your MCQ Bot account',
           message: `Hi ${user.name},\n\nYour verification code is: ${otp}\n\nThis code expires in 15 minutes.`,
           htmlMessage: `<h3>Hi ${user.name},</h3><p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 15 minutes.</p>`,
         });
       } catch (err) {
         console.error("Failed to send verification email on login attempt", err);
       }

       return res.status(403).json({ 
         requiresVerification: true,
         email: user.email,
         message: 'Please verify your email address to log in. We have sent a new verification code to your email.' 
       });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        currentSubscription: user.currentSubscription,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Google ID token is required' });
    }

    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture: profilePicture } = payload;

    // Check if user already exists
    let user = await User.findOne({ email }).populate('currentSubscription');

    if (user) {
      // If user exists but doesn't have a googleId, link it
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = profilePicture || user.profilePicture;
        await user.save();
      }

      // Return standard login response
      return res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        currentSubscription: user.currentSubscription,
        token: generateToken(user._id),
      });
    }

    // Create user if they don't exist
    user = await User.create({
      name,
      email,
      googleId,
      profilePicture,
      isVerified: true // Google accounts are implicitly verified
    });

    // Send welcome email (asynchronous)
    sendEmail({
      email: user.email,
      subject: 'Welcome to MCQ Bot!',
      message: `Hi ${user.name},\n\nWelcome to MCQ Bot! We're excited to have you on board via Google Login.\n\nEnjoy generating unlimited MCQs!`,
      htmlMessage: `<h3>Hi ${user.name},</h3><p>Welcome to MCQ Bot! We're excited to have you on board via Google Login.</p><p>Enjoy generating unlimited MCQs!</p>`,
    });

    // Return standard registration response
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url (this should point to your frontend React app)
    const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
        htmlMessage: `<p>You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link below to reset it:</p><a href="${resetUrl}" target="_blank">Reset Password</a>`,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new password' });
    }

    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has a password (google users might not)
    if (!user.password) {
      return res.status(400).json({ message: 'You registered with Google and do not have a password to update. Please use Google to login.' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error("Update Password Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user._id).populate('currentSubscription');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update name if changed
    user.name = name || user.name;
    
    // Check if email is being changed
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
         return res.status(400).json({ message: 'Email is already in use' });
      }

      // Generate OTP
      const otp = user.getEmailChangeOtp();
      user.pendingNewEmail = email;
      await user.save();

      // Send OTP via email
      const message = `You requested an email change. Your OTP is: ${otp}\n\nThis OTP is valid for 15 minutes.`;
      
      try {
        await sendEmail({
          email: email, // Send to the NEW email address to verify they own it
          subject: 'Verify your new email address',
          message,
          htmlMessage: `<h3>Email Verification</h3><p>You requested an email change. Your OTP is: <strong>${otp}</strong></p><p>This OTP is valid for 15 minutes.</p>`,
        });

        return res.status(200).json({
          requiresOtp: true,
          message: 'OTP sent to your new email address. Please verify to complete the change.'
        });
      } catch (err) {
        console.error("Error sending OTP:", err);
        user.emailChangeOtp = undefined;
        user.emailChangeOtpExpire = undefined;
        user.pendingNewEmail = undefined;
        await user.save();
        return res.status(500).json({ message: 'Email could not be sent' });
      }
    }

    // If no email change, just save and return
    await user.save();

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      currentSubscription: user.currentSubscription,
      token: generateToken(user._id),
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyEmailChange = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: 'Please provide the OTP' });
    }

    const user = await User.findById(req.user._id).populate('currentSubscription');

    if (!user || !user.emailChangeOtp || !user.pendingNewEmail) {
      return res.status(400).json({ message: 'No pending email change request found' });
    }

    // Check expiration
    if (user.emailChangeOtpExpire < Date.now()) {
      user.emailChangeOtp = undefined;
      user.emailChangeOtpExpire = undefined;
      user.pendingNewEmail = undefined;
      await user.save();
      return res.status(400).json({ message: 'OTP has expired. Please try changing your email again.' });
    }

    // Hash the input OTP and compare
    const hashedOtp = crypto
      .createHash('sha256')
      .update(otp.toString())
      .digest('hex');

    if (user.emailChangeOtp !== hashedOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Success! Update the email
    user.email = user.pendingNewEmail;
    
    // Clear OTP fields
    user.emailChangeOtp = undefined;
    user.emailChangeOtpExpire = undefined;
    user.pendingNewEmail = undefined;
    
    await user.save();

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      currentSubscription: user.currentSubscription,
      token: generateToken(user._id),
      message: 'Email updated successfully'
    });

  } catch (error) {
    console.error("Verify Email Change Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyRegistration = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and OTP' });
    }

    const user = await User.findOne({ email }).populate('currentSubscription');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified' });
    }

    if (!user.verificationOtp || user.verificationOtpExpire < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    const hashedOtp = crypto
      .createHash('sha256')
      .update(otp.toString())
      .digest('hex');

    if (user.verificationOtp !== hashedOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Success! Verify the user
    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpire = undefined;
    await user.save();

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      currentSubscription: user.currentSubscription,
      token: generateToken(user._id),
      message: 'Email verified successfully! You are now logged in.'
    });

  } catch (error) {
    console.error("Verify Registration Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resendVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified' });
    }

    const otp = user.getVerificationOtp();
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify your MCQ Bot account',
        message: `Hi ${user.name},\n\nYour new verification code is: ${otp}\n\nThis code expires in 15 minutes.`,
        htmlMessage: `<h3>Hi ${user.name},</h3><p>Your new verification code is: <strong>${otp}</strong></p><p>This code expires in 15 minutes.</p>`,
      });

      res.status(200).json({ message: 'A new verification code has been sent to your email.' });
    } catch (err) {
      console.error("Error sending OTP on resend:", err);
      user.verificationOtp = undefined;
      user.verificationOtpExpire = undefined;
      await user.save();
      return res.status(500).json({ message: 'Could not send verification email. Please try again.' });
    }
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
