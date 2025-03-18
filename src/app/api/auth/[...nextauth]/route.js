import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import pool from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("🔹 Checking user in DB...");

          // Query the database for the user
          const [users] = await pool.query(
            "SELECT * FROM admin_users WHERE username = ? LIMIT 1",
            [credentials.username]
          );

          if (!users.length) {
            console.log("❌ User not found.");
            throw new Error("Invalid credentials");
          }

          const user = users[0];

          // Verify password
          const isValid = await bcryptjs.compare(credentials.password, user.password);
          if (!isValid) {
            console.log("❌ Password incorrect.");
            throw new Error("Invalid credentials");
          }

          console.log("✅ Login successful:", user.username, "Role:", user.role);
          return { id: user.id, username: user.username, role: user.role }; // Include role
        } catch (error) {
          console.error("❌ Login error:", error.message);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("🔹 Session:", session);
      if (token) {
        session.user = { id: token.id, username: token.username, role: token.role };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role; // Ensure role is included
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
