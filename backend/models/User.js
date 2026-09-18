const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    preferences: {
      topics: {
        type: [String],
        default: [
          "Technology",
          "Artificial Intelligence",
          "Markets",
          "Startups",
        ],
      },
      preferredVoice: {
        type: String,
        default: "JBFqnCBsd6RMkjVDRZzb", // George
      },
      briefLength: {
        type: Number,
        default: 10, // minutes
      },
      language: {
        type: String,
        default: "en",
      },
      playbackSpeed: {
        type: Number,
        default: 1.0,
      },
      onboardingComplete: {
        type: Boolean,
        default: false,
      },
    },
    history: [
      {
        articleId: String,
        title: String,
        playedAt: { type: Date, default: Date.now },
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
