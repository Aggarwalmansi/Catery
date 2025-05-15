// app/layout.tsx
import "./globals.css";
import { OccasionProvider } from "./context /OccasionContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OccasionProvider>
          {children}
        </OccasionProvider>
      </body>
    </html>
  );
}
