/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Backend wraps responses: { success, message, data }
        const { data } = await api.get('/api/auth/profile')
        setUser(data.data)
      } catch {
        // 401 is expected when not logged in — silently clear user
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', {
      email,
      password,
    })
    setUser(data.data)
    return data.data
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', {
      name,
      email,
      password,
    })
    setUser(data.data)
    return data.data
  }

  const logout = async () => {
    await api.post('/api/auth/logout')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
