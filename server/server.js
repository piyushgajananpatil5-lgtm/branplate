 const express = require('express');
 const cors = require('cors');
 require('dotenv').config();
 const connectDB = require('./config/db');
+const AdminUser = require('./models/AdminUser');

 const app = express();

 connectDB();

+// One-time, idempotent bootstrap: whitelist FIRST_ADMIN_EMAIL as an admin
+// if it isn't already in the DB. Safe to run on every startup — it only
+// inserts when the record is missing, so redeploys won't duplicate it.
+// This replaces having to run `npm run seed` manually via a shell.
+(async () => {
+  const firstAdminEmail = (process.env.FIRST_ADMIN_EMAIL || '').toLowerCase();
+  if (!firstAdminEmail) return;
+  try {
+    const exists = await AdminUser.findOne({ email: firstAdminEmail });
+    if (!exists) {
+      await AdminUser.create({ email: firstAdminEmail, role: 'owner' });
+      console.log(`Whitelisted first admin on startup: ${firstAdminEmail}`);
+    }
+  } catch (err) {
+    console.error('First-admin bootstrap failed:', err.message);
+  }
+})();
+
 // Accepts CLIENT_URL exactly (your custom domain / primary Vercel domain)
