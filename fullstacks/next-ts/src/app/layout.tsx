import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import AppShell from '@/components/AppShell'
import './globals.css'

export const metadata: Metadata = {
  title: '时间胶囊-Next',
  description: '时间胶囊应用的 Next 实现',
}

interface Props {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('theme');
                var theme = stored === 'dark' || stored === 'light'
                  ? stored
                  : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
