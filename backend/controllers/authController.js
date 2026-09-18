const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { getDBStatus } = require("../config/db");
const { memoryUsers } = require("../middleware/authMiddleware");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "nuzio_ai_secure_token_secret_key_2026_x89",
    { expiresIn: "30d" },
  );
};

// @desc    Register a new user (Email & Password)
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, topics, preferredVoice, language } =
      req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (getDBStatus()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        preferences: {
          topics: topics || [
            "Technology",
            "Artificial Intelligence",
            "Markets",
          ],
          preferredVoice: preferredVoice || "JBFqnCBsd6RMkjVDRZzb",
          language: language || "en",
          onboardingComplete: false,
        },
      });

      const token = generateToken(user._id);
      res.cookie("token", token, {
        secure: false,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          preferences: user.preferences,
        },
      });
    }

    // // Memory fallback
    // for (const [_, u] of memoryUsers) {
    //   if (u.email === normalizedEmail) {
    //     return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    //   }
    // }

    // const id = 'mem_' + Date.now();

    // const memUser = {
    //   _id: id,
    //   name,
    //   email: normalizedEmail,
    //   password: hashedPassword,
    //   avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    //   preferences: {
    //     topics: topics || ['Technology', 'Artificial Intelligence', 'Markets'],
    //     preferredVoice: preferredVoice || 'JBFqnCBsd6RMkjVDRZzb',
    //     briefLength: 10,
    //     playbackSpeed: 1.0,
    //   }
    // };

    // memoryUsers.set(id, memUser);
    // const token = generateToken(id);

    // return res.status(201).json({
    //   success: true,
    //   token,
    //   user: {
    //     id: memUser._id,
    //     name: memUser.name,
    //     email: memUser.email,
    //     avatar: memUser.avatar,
    //     preferences: memUser.preferences,
    //   }
    // });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during registration." });
  }
};

// @desc    Login user with email & password
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (getDBStatus()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password." });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid password." });
      }

      const token = generateToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          preferences: user.preferences,
        },
      });
    }

    // // Memory fallback
    // for (const [_, u] of memoryUsers) {
    //   if (u.email === normalizedEmail) {
    //     const isMatch = await bcrypt.compare(password, u.password);
    //     if (!isMatch) {
    //       return res
    //         .status(401)
    //         .json({ success: false, message: "Invalid email or password." });
    //     }
    //     const token = generateToken(u._id);
    //     return res.json({
    //       success: true,
    //       token,
    //       user: {
    //         id: u._id,
    //         name: u.name,
    //         email: u.email,
    //         avatar: u.avatar,
    //         preferences: u.preferences,
    //       },
    //     });
    //   }
    // }

    // return res
    //   .status(401)
    //   .json({ success: false, message: "Invalid email or password." });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during login." });
  }
};

// @desc    Get Current Logged in User Profile
// @route   GET /api/auth/me
const getMe = (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};

// @desc    Update Preferences (topics, voice, brief length)
// @route   PUT /api/auth/preferences
const updatePreferences = async (req, res) => {
  try {
    const {
      topics,
      preferredVoice,
      briefLength,
      playbackSpeed,
      language,
      onboardingComplete,
    } = req.body;

    if (getDBStatus()) {
      const user = await User.findById(req.user._id || req.user.id);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      if (topics) user.preferences.topics = topics;
      if (preferredVoice) user.preferences.preferredVoice = preferredVoice;
      if (briefLength) user.preferences.briefLength = briefLength;
      if (playbackSpeed) user.preferences.playbackSpeed = playbackSpeed;
      if (language) user.preferences.language = language;
      if (typeof onboardingComplete === "boolean")
        user.preferences.onboardingComplete = onboardingComplete;

      await user.save();
      return res.json({ success: true, preferences: user.preferences });
    }

    if (memoryUsers.has(req.user._id || req.user.id)) {
      const u = memoryUsers.get(req.user._id || req.user.id);
      if (topics) u.preferences.topics = topics;
      if (preferredVoice) u.preferences.preferredVoice = preferredVoice;
      if (briefLength) u.preferences.briefLength = briefLength;
      if (playbackSpeed) u.preferences.playbackSpeed = playbackSpeed;
      if (language) u.preferences.language = language;
      if (typeof onboardingComplete === "boolean")
        u.preferences.onboardingComplete = onboardingComplete;
      return res.json({ success: true, preferences: u.preferences });
    }

    return res.json({ success: true, preferences: req.user.preferences });
  } catch (error) {
    console.error("Update preferences error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update preferences" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Logged out error: ", error });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updatePreferences,
  logout,
};
