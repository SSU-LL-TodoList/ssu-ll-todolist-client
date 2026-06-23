import { useEffect, useState } from 'react'
import Login from './login.jsx'
import Second from './second.jsx'

const MEMBER_ID_STORAGE_KEY = 'todoMemberId'

export default function App() {
  const [memberId, setMemberId] = useState(() => sessionStorage.getItem(MEMBER_ID_STORAGE_KEY))
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

  const handleLoginSuccess = (nextMemberId) => {
    sessionStorage.setItem(MEMBER_ID_STORAGE_KEY, nextMemberId)
    setMemberId(nextMemberId)
    movePath('/main')
  }

  const handleLogout = () => {
    sessionStorage.removeItem(MEMBER_ID_STORAGE_KEY)
    setMemberId(null)
    movePath('/')
  }

  if (memberId && path === '/main') {
    return <Second memberId={memberId} onLogout={handleLogout} />
  }

  return <Login onLoginSuccess={handleLoginSuccess} />
}
