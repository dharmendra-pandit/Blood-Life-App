import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
