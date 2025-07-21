// app/layout.tsx
import "./globals.css";
import { OccasionProvider } from "./context /OccasionContext";
import { AuthProvider } from "./context /AuthContext";
import {Toaster} from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
    
        <OccasionProvider>
        <AuthProvider>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
        </OccasionProvider>
      </body>
    </html>
  );
}
