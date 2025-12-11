import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata = {
  title: {
    default:
      "Tân Phong Technology - Giải pháp Chuyển đổi số & ERP cho Doanh nghiệp",
    template: "%s | Tân Phong Technology",
  },
  description:
    "Chuyên cung cấp giải pháp ERP, EdTech, phát triển phần mềm cho doanh nghiệp tại Hải Phòng. Đối tác tin cậy chuyển đổi số. Hotline: 0989 150 269",
  keywords: [
    "giải pháp ERP",
    "phần mềm quản lý doanh nghiệp",
    "chuyển đổi số",
    "EdTech",
    "phần mềm giáo dục",
    "phát triển phần mềm",
    "công nghệ thông tin Hải Phòng",
    "tư vấn CNTT",
    "Tân Phong Technology",
    "hệ thống quản trị doanh nghiệp",
  ],
  authors: [{ name: "Tân Phong Technology" }],
  creator: "Tân Phong Technology",
  publisher: "Công ty Cổ phần Công nghệ Thương mại Tân Phong",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://tanphong.ai.vn"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://tanphong.ai.vn",
    siteName: "Tân Phong Technology",
    title: "Tân Phong Technology - Giải pháp Chuyển đổi số & ERP",
    description:
      "Đối tác tin cậy trong chuyển đổi số - Cung cấp giải pháp ERP, EdTech và phát triển phần mềm cho doanh nghiệp",
    images: [
      {
        url: "/tanphong-removebg-preview.png",
        width: 1200,
        height: 630,
        alt: "Tân Phong Technology - Giải pháp CNTT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tân Phong Technology - Giải pháp Chuyển đổi số & ERP",
    description: "Đối tác tin cậy trong chuyển đổi số cho doanh nghiệp",
    images: ["/tanphong-removebg-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
    // Thêm verification codes khác nếu cần
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={roboto.className}>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta name="theme-color" content="#007BFF" />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Công ty Cổ phần Công nghệ Thương mại Tân Phong",
              alternateName: "Tân Phong Technology",
              url: "https://tanphong.ai.vn",
              logo: "https://tanphong.vn/tanphong-removebg-preview.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+84-989-150-269",
                contactType: "customer service",
                areaServed: "VN",
                availableLanguage: ["vi"],
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "Số 13 lô 7 Quán Nam, Ngô Kim Tài",
                addressLocality: "Phường Kênh Dương, Quận Lê Chân",
                addressRegion: "Hải Phòng",
                addressCountry: "VN",
              },
              sameAs: [
                "https://www.facebook.com/tanphongtech",
                "https://www.linkedin.com/company/tanphongtech",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
