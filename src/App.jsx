import { useEffect, useState } from 'react'
import Login from './login.jsx'
import Second from './second.jsx'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const movePath = (nextPath) => {
    window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    movePath('/main')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    movePath('/')
  }

  if (isLoggedIn && path === '/main') {
    return <Second onLogout={handleLogout} />
  }

  return <Login onLoginSuccess={handleLoginSuccess} />
}
