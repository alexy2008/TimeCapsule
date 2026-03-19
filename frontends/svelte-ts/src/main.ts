import { mount } from 'svelte'

// Import global styles (from spec directory)
import '@spec/styles/tokens.css'
import '@spec/styles/base.css'
import '@spec/styles/components.css'
import '@spec/styles/layout.css'

import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
