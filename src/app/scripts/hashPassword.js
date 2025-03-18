const bcrypt = require("bcrypt");

const password = "admin"; // 🔹 Change this to the password you want
const saltRounds = 10; // 🔹 Higher is more secure but slower

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error("❌ Error hashing password:", err);
  } else {
    console.log("🔑 Hashed Password:", hash);
  }
});
