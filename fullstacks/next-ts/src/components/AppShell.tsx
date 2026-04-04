import type { ReactNode } from 'react'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import styles from './AppShell.module.css'

interface Props {
  children: ReactNode
}

export default function AppShell({ children }: Props) {
  return (
    <>
      <div className="ambient-glow"></div>
      <div className="background-grid"></div>
      <div className={styles.appContainer}>
        <AppHeader />
        <main className="app-main">{children}</main>
        <AppFooter />
      </div>
    </>
  )
}
