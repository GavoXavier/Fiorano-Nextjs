import { redirect } from "next/navigation";

export default function Home() {
  redirect("/user"); // ✅ Automatically redirect to User Homepage
}
