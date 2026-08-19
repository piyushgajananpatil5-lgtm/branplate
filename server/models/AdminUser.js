const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Whitelist of Gmail addresses allowed to hold an admin account.
// An entry can exist here before the admin has signed up (invited),
// and gets linked to a password once they complete admin signup.
const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String }, // set once the admin completes signup
    role: { type: String, enum: ['owner', 'admin'], default: 'admin' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

adminUserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminUserSchema.methods.comparePassword = function (candidate) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('AdminUser', adminUserSchema);
