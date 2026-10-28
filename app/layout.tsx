import "./globals.css";
import AuthProvider from "./components/AuthProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-[#fdfbf7] text-[#333333]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}