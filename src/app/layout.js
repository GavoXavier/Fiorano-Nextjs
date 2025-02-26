import "./globals.css";

export const metadata = {
  title: "Fiorano API Docs",
  description: "Admin panel and user-facing API documentation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
