const Admin = require("../models/Admin");

const ADMIN_DEFAULT_EMAIL = "SchoolAdmin@gmail.com";
const ADMIN_DEFAULT_PASSWORD = "SchoolAdmin@234@#";
const ADMIN_DEFAULT_NAME = "School Administrator";

const seedAdminUser = async () => {
  try {
    const normalizedEmail = ADMIN_DEFAULT_EMAIL.toLowerCase().trim();
    let admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      admin = new Admin({
        name: ADMIN_DEFAULT_NAME,
        email: normalizedEmail,
        password: ADMIN_DEFAULT_PASSWORD,
        role: "admin",
      });
      await admin.save();
      console.log(`[Admin Seed] Created default admin account: ${normalizedEmail}`);
    } else {
      // Ensure password is up to date if user changed requirements
      const isMatch = await admin.matchPassword(ADMIN_DEFAULT_PASSWORD);
      if (!isMatch) {
        admin.password = ADMIN_DEFAULT_PASSWORD;
        await admin.save();
        console.log(`[Admin Seed] Updated password for admin account: ${normalizedEmail}`);
      } else {
        console.log(`[Admin Seed] Admin account verified in database: ${normalizedEmail}`);
      }
    }
  } catch (error) {
    console.error(`[Admin Seed] Error seeding admin account:`, error.message);
  }
};

module.exports = {
  seedAdminUser,
  ADMIN_DEFAULT_EMAIL,
  ADMIN_DEFAULT_PASSWORD,
};

