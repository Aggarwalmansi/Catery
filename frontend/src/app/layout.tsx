import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'OccasionOS - Premium Catering & Event Planning',
  description: 'Plan your perfect event with OccasionOS.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
