const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    apiKey: { type: String }, // Generate a unique API key on creation
    usage: [{ date: Date, count: Number }],
    rateLimit: Number,
    active: {type: Boolean, default: true} // Optional: Define a custom rate limit
  },
  { timestamps: true }
);
developerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

developerSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Developer", developerSchema);
