import authmodel from "./models/authmodel.js";
import bcrypt from "bcryptjs";
import { PERMISSIONS } from "./config/permissions.js";

export const seedDefaultAdmin = async () => {
  try {
    // ⚠️ Security: Production में इसे .env से ही उठाएं
    const adminEmail = process.env.ADMIN_EMAIL || "careervidyaedutech@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "yogesh@2003";

    // ✅ सिर्फ ईमेल से चेक करें (ताकि Duplicate Email Error न आए)
    const existingUser = await authmodel.findOne({
      where: { email: adminEmail }
    });

    if (existingUser) {
      // अगर यूजर है पर एडमिन नहीं है, तो उसे प्रमोट करें
      if (existingUser.role !== 'admin') {
        await existingUser.update({
          role: "admin",
          status: "active",
          isVerified: true,
          permissions: PERMISSIONS ? Object.values(PERMISSIONS) : []
        });
        console.log("⚡ Existing user promoted to Admin");
      } else {
        console.log("⚡ Admin already exists");
      }
      return;
    }

    // ✅ Safe permissions logic
    const allPermissions = PERMISSIONS ? Object.values(PERMISSIONS) : [];

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // ✅ Create admin
    await authmodel.create({
      email: adminEmail,
      password: hashedPassword,
      name: "Default Admin",
      phone: "0000000000",
      countryCode: "+00",
      role: "admin",
      permissions: allPermissions,
      isVerified: true,
      status: "active",
    });

    console.log(`✅ Default admin seeded successfully: ${adminEmail}`);

  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
  }
};