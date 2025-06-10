// app/layout.tsx
import "./globals.css";
import { OccasionProvider } from "./context /OccasionContext";
import { AuthProvider } from "./context /AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
    
        <OccasionProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
        </OccasionProvider>
      </body>
    </html>
  );
}
