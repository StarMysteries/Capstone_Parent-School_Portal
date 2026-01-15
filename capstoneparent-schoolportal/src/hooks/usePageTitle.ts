import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/': 'Home | Parent-School Portal',
  '/announcements': 'Announcements | Parent-School Portal',
  '/login': 'Login | Parent-School Portal',
  '/register': 'Register | Parent-School Portal',
  '/forgotpassword': 'Forgot Password | Parent-School Portal',
}

export const usePageTitle = () => {
  const location = useLocation()

  useEffect(() => {
    const title = pageTitles[location.pathname] || 'Parent-School Portal'
    document.title = title
  }, [location.pathname])
}
