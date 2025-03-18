import pool from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// ✅ Force Next.js to use Node.js runtime (fix Edge Runtime errors)
export const runtime = "nodejs"; 

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // ✅ 1. Check if the admin exists
    const [users] = await pool.query("SELECT * FROM admin_users WHERE username = ?", [username]);

    if (users.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid username or password" }), { status: 401 });
    }

    const user = users[0];

    // ✅ 2. Validate password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid username or password" }), { status: 401 });
    }

    // ✅ 3. Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1d" });

    // ✅ 4. Store session token in the database
    await pool.query("UPDATE admin_users SET session_token = ? WHERE id = ?", [token, user.id]);

    // ✅ 5. Set HTTP-Only Cookie & return response
    return new Response(JSON.stringify({ message: "Login successful" }), {
      status: 200,
      headers: { "Set-Cookie": `session_token=${token}; HttpOnly; Path=/; Max-Age=86400` },
    });

  } catch (error) {
    console.error("❌ Error logging in:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
