import { NavLink, Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import logoSvg from '@spec/assets/logo.svg'
import styles from './AppHeader.module.css'

export default function AppHeader() {
  return (
    <header className={styles.header}>
      <div className="container flex items-center justify-between">
        <Link to="/" className={styles.logo}>
          <img src={logoSvg} alt="logo" className={styles.logoImg} />
          <span className={styles.logoText}>时间胶囊</span>
        </Link>
        <nav className="nav flex items-center gap-4">
          <NavLink to="/" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>首页</NavLink>
          <NavLink to="/create" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>创建</NavLink>
          <NavLink to="/open" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>开启</NavLink>
          <NavLink to="/about" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>关于</NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
