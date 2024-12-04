import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Admin from './Admin'
import Driver from './Driver'
import Login from './components/Login'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo')
    const driverInfo = localStorage.getItem('driverInfo')
    
    if (adminInfo) {
      setIsAuthenticated(true)
      setUserRole('admin')
    } else if (driverInfo) {
      setIsAuthenticated(true)
      setUserRole('driver')
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated 
              ? <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
              : <Navigate to="/dashboard" replace />
          } 
        />
        <Route 
          path="/dashboard/*" 
          element={
            isAuthenticated 
              ? userRole === 'admin'
                ? <Admin setIsAuthenticated={setIsAuthenticated} />
                : <Driver setIsAuthenticated={setIsAuthenticated} />
              : <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to="/dashboard" replace />} 
        />
      </Routes>
    </Router>
  )
}

export default App
