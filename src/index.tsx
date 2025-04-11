import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './components/App/App'
import store from './Store/store'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Контейнер с id "root" не найден')
}

const root = ReactDOM.createRoot(container as HTMLElement)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
