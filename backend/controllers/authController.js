const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

// Helper: create a JWT for a logged-in user
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    // role defaults to "student" - admin accounts are created manually/seeded, never via public signup
    const user = await User.create({ name, email, password });

    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      // deliberately vague message - don't reveal whether email exists (security best practice)
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
};

// @route POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Same response whether user exists or not - prevents attackers from discovering valid emails
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been sent." });
    }

    const rawToken = user.generateResetToken();
    await user.save();

    // TODO (Day 8/9 area): wire this into nodemailer to actually send the email.
    // For now, the raw token is returned in the response so you can test the flow manually.
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    res.json({ message: "If that email exists, a reset link has been sent.", resetUrl });
  } catch (err) {
    res.status(500).json({ error: "Request failed", details: err.message });
  }
};

// @route POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Hash the incoming token the same way it was hashed at generation, then compare
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // must not be expired
    });

    if (!user) {
      return res.status(400).json({ error: "Reset link is invalid or has expired" });
    }

    user.password = newPassword; // pre-save hook in User model will hash this automatically
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    res.status(500).json({ error: "Reset failed", details: err.message });
  }
};
