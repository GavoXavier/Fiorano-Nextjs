import pool from "@/lib/db";

export const runtime = "nodejs"; // ✅ Fix Edge Runtime error

export async function POST(req) {
  try {
    const sessionToken = req.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return new Response(JSON.stringify({ error: "Not logged in" }), { status: 401 });
    }

    // ✅ Remove session token from the database
    await pool.query("UPDATE admin_users SET session_token = NULL WHERE session_token = ?", [sessionToken]);

    // ✅ Clear session cookie
    return new Response(JSON.stringify({ message: "Logged out successfully" }), {
      status: 200,
      headers: { "Set-Cookie": "session_token=; HttpOnly; Path=/; Max-Age=0" },
    });
  } catch (error) {
    console.error("❌ Error logging out:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
