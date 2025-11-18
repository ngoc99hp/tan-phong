import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

export const metadata = {
  title: 'Công ty Cổ phần Công nghệ Thương mại Tân Phong',
  description: 'Đối tác tin cậy trong lĩnh vực công nghệ thông tin, cung cấp giải pháp toàn diện từ phần cứng đến phần mềm',
  keywords: 'công nghệ thông tin, máy tính, phần mềm, viễn thông, Hải Phòng, giải pháp công nghệ thông tin, ERP, EdTech, Chuyển đổi số',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={roboto.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}