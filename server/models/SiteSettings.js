const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'contact', unique: true },
    phone: { type: String, default: '+91 00000 00000' },
    email: { type: String, default: 'hello@branplate.com' },
    address: { type: String, default: 'Central India' },
    businessHours: { type: String, default: 'Mon–Sat, 9am–6pm' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
