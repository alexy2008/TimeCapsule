import { Route, Router } from '@solidjs/router'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import HomeRoute from '@/routes/HomeRoute'
import CreateRoute from '@/routes/CreateRoute'
import OpenRoute from '@/routes/OpenRoute'
import AboutRoute from '@/routes/AboutRoute'
import AdminRoute from '@/routes/AdminRoute'
import styles from './App.module.css'

export default function App() {
  return (
    <Router
      root={props => (
        <>
          <div class="ambient-glow"></div>
          <div class="background-grid"></div>
          <div class={styles.appContainer}>
            <AppHeader />
            <main class="app-main">{props.children}</main>
            <AppFooter />
          </div>
        </>
      )}
    >
      <Route path="/" component={HomeRoute} />
      <Route path="/create" component={CreateRoute} />
      <Route path="/open" component={OpenRoute} />
      <Route path="/open/:code" component={OpenRoute} />
      <Route path="/about" component={AboutRoute} />
      <Route path="/admin" component={AdminRoute} />
    </Router>
  )
}
