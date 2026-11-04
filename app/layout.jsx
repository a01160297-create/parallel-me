import "./globals.css";

export const metadata = {
  title: 'Parallel Letter',
  description: '並行世界の自分から手紙が届くサイト',
  openGraph: {
    title: 'Parallel Letter',
    description: 'もしもあの日、違う道を選んでいたら。並行世界のあなたから手紙が届きます。',
    url: 'https://parallel-me-pearl.vercel.app',
    siteName: 'Parallel Letter',
    images: [
      {
        url: 'https://parallel-me-pearl.vercel.app/Gemini_Generated_Image_u9i9h0u9i9h0u9i9.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-[#0f1115] text-gray-300">{children}</body>
    </html>
  );
}
