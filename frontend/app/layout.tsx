import type { Metadata } from 'next';
import './globals.css';
import MainLayout from './layouts/MainLayout';

export const metadata: Metadata = {
  title: 'To Dentists',
  description: 'คลินิกทันตกรรมทูเด็นทิสท์ - จองคิวง่าย ๆ ผ่านเว็บและ LINE LIFF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
