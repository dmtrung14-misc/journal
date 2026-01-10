import './globals.css'
import type { Metadata } from 'next'
import { Inter, Noto_Serif } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })
const notoSerif = Noto_Serif({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-noto-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'My Personal Journal',
  description: 'A personal blog platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${notoSerif.variable}`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
}

