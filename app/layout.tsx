import "./globals.css"; // DÒNG NÀY LÀ LINH HỒN CỦA GIAO DIỆN
import AuthProvider from "./components/AuthProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}