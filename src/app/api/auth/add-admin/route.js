import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // ✅ Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert new admin user
    await pool.query("INSERT INTO admin_users (username, password) VALUES (?, ?)", [username, hashedPassword]);

    return new Response(JSON.stringify({ message: "✅ Admin user added successfully!" }), { status: 201 });

  } catch (error) {
    console.error("❌ Error adding admin user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
