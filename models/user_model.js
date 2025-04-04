const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String },
    password: { type: String },
    status: { type: String },
    role: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model("users", userSchema);
 