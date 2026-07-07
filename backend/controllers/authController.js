const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOTP, hashOTP, verifyOTP, isOTPExpired, generateOTPExpiry } = require("../utils/otp");
const { sendRegistrationOTP, sendResendOTP, sendPasswordResetOTP } = require("../utils/emailService");

// REGISTER WITH OTP - Send OTP for email verification
exports.registerUser = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ message: "Request body is missing" });

        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // ROLE LIMIT VALIDATIONS
        if (role === "admin") {
            const adminCount = await User.countDocuments({ role: "admin" });
            if (adminCount >= 1) {
                return res
                    .status(403)
                    .json({ message: "Admin already exists. Cannot create another admin." });
            }
        }

        if (role === "warden") {
            const wardenCount = await User.countDocuments({ role: "warden" });
            if (wardenCount >= 2) {
                return res
                    .status(403)
                    .json({ message: "Maximum number of wardens already exist." });
            }
        }

        // Generate OTP
        const otp = generateOTP();
        const hashedOTP = await hashOTP(otp);
        const otpExpiry = generateOTPExpiry(10); // 10 minutes

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store registration data temporarily
        const registrationData = {
            name,
            email,
            password: hashedPassword,
            role: role || "student",
        };

        // Create temporary user record with OTP
        const tempUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "student",
            registrationOTP: hashedOTP,
            registrationOTPExpires: otpExpiry,
            registrationData,
        });

        await tempUser.save();

        // Send OTP email (non-blocking)
        try {
          await sendRegistrationOTP(email, name, otp);
        } catch (emailError) {
          console.error("Email sending failed:", emailError.message);
          // Continue even if email fails for now
        }

        res.status(200).json({
            message: "OTP sent to your email for verification",
            email: email,
        });
    } catch (error) {
        res.status(500).json({ message: "Error initiating registration", error: error.message });
    }
};

// VERIFY OTP - Complete registration after OTP verification
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.registrationOTP || !user.registrationOTPExpires) {
            return res.status(400).json({ message: "No pending registration found" });
        }

        // Check if OTP is expired
        if (isOTPExpired(user.registrationOTPExpires)) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Verify OTP
        const isValidOTP = await verifyOTP(otp, user.registrationOTP);

        if (!isValidOTP) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Clear OTP fields
        user.registrationOTP = undefined;
        user.registrationOTPExpires = undefined;
        user.registrationData = undefined;

        await user.save();

        res.status(200).json({ message: "Email verified successfully. You can now login." });
    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
};

// RESEND OTP
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.registrationOTP || !user.registrationOTPExpires) {
            return res.status(400).json({ message: "No pending registration found" });
        }

        // Generate new OTP
        const otp = generateOTP();
        const hashedOTP = await hashOTP(otp);
        const otpExpiry = generateOTPExpiry(10); // 10 minutes

        // Update OTP
        user.registrationOTP = hashedOTP;
        user.registrationOTPExpires = otpExpiry;

        await user.save();

        // Send new OTP email (non-blocking)
        try {
          await sendResendOTP(email, user.name, otp);
        } catch (emailError) {
          console.error("Email sending failed:", emailError.message);
          // Continue even if email fails for now
        }

        res.status(200).json({ message: "New OTP sent to your email" });
    } catch (error) {
        res.status(500).json({ message: "Error resending OTP", error: error.message });
    }
};

// LOGIN
exports.loginUser = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ message: "Request body is missing" });

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate access token (short-lived - 15 minutes)
        const accessToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Generate refresh token (long-lived - 7 days)
        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Hash refresh token and store in database
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        user.refreshToken = hashedRefreshToken;
        await user.save();

        // Set refresh token in httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

        res.json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};


// Forgot password - Generate and send OTP for password reset
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);
    const otpExpiry = generateOTPExpiry(15); // 15 minutes

    // Store hashed OTP
    user.resetOTP = hashedOTP;
    user.resetOTPExpires = otpExpiry;
    await user.save();

    // Send OTP email (non-blocking)
    try {
      await sendPasswordResetOTP(email, user.name, otp);
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      // Continue even if email fails for now
    }

    res.json({ message: "OTP sent to your email for password reset" });

  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};


// Reset password using OTP
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetOTP || !user.resetOTPExpires) {
      return res.status(400).json({ message: "No password reset request found" });
    }

    // Check if OTP is expired
    if (isOTPExpired(user.resetOTPExpires)) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Verify OTP
    const isValidOTP = await verifyOTP(otp, user.resetOTP);

    if (!isValidOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP fields
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;

    // Clear refresh token to invalidate all sessions
    user.refreshToken = undefined;

    await user.save();

    res.json({ message: "Password updated successfully. Please login with your new password." });

  } catch (error) {
    res.status(500).json({ message: "Failed to reset password", error: error.message });
  }
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Verify refresh token matches the one in database
    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      path: '/'
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};
