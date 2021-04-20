const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: 'basic',
      enum: ['basic', 'supervisor', 'admin'],
    },
    accessToken: { type: String },
    isVerify: { type: Boolean, default: false }
  },
  { timestamps: true }
);

var User = mongoose.model('User', UserSchema);
module.exports = User;
