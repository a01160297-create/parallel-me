import 'tailwindcss/tailwind.css'

export const metadata = {
  title: 'Parallel Me - 並行世界の私からの手紙',
  description: '選ばなかった世界線を生きる自分からの手紙を受信するアプリ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
