import './globals.css'

export const metadata = {
  title: 'Parallel Me - 並行世界の私からの手紙',
  description: '選ばなかった世界線を生きる自分からの手紙を受信するアプリ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="bg-slate-900 text-slate-200 min-h-screen">{children}</body>
    </html>
  )
}
