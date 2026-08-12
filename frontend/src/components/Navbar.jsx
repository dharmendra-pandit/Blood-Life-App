import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Droplet, Menu, X, User as UserIcon, LogOut, LayoutDashboard, Search, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      setIsOpen(false)
      navigate('/login')
    } catch (err) {
      console.error('Failed to logout', err)
    }
  }

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-red-50 text-red-600 shadow-sm border border-red-100'
        : 'text-slate-600 hover:text-red-500 hover:bg-slate-50'
    }`

  const getMobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-red-50 text-red-600 border border-red-100'
        : 'text-slate-600 hover:text-red-500 hover:bg-slate-50'
    }`

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm fixed w-full z-50 top-0 left-0 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-red-50 text-red-500 rounded-xl group-hover:bg-red-100 transition-colors">
                <Droplet className="h-6 w-6 fill-current text-red-500" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                Blood<span className="text-red-500">Life</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/search" className={getNavLinkClass}>
              <Search className="w-4 h-4" />
              Find Blood
            </NavLink>

            <NavLink to="/emergency" className={getNavLinkClass}>
              <AlertCircle className="w-4 h-4" />
              Emergency
            </NavLink>

            {user ? (
              <>
                <NavLink to="/dashboard" className={getNavLinkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </NavLink>

                <div className="flex items-center gap-3 pl-3 ml-2 border-l border-slate-200">
                  <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-full text-slate-800 font-semibold text-sm">
                    <UserIcon className="w-4 h-4 text-red-500" />
                    <span>{user.name}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm font-semibold"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 pl-2">
                <NavLink to="/login" className={getNavLinkClass}>
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-md transition-all ${
                      isActive
                        ? 'bg-red-700 shadow-red-300 ring-2 ring-red-400 ring-offset-1'
                        : 'bg-red-500 hover:bg-red-600 shadow-red-200'
                    }`
                  }
                >
                  Donate Now
                </NavLink>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <NavLink
            to="/search"
            onClick={() => setIsOpen(false)}
            className={getMobileNavLinkClass}
          >
            <Search className="w-4 h-4" />
            Find Blood
          </NavLink>

          <NavLink
            to="/emergency"
            onClick={() => setIsOpen(false)}
            className={getMobileNavLinkClass}
          >
            <AlertCircle className="w-4 h-4" />
            Emergency
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={getMobileNavLinkClass}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard ({user.name})
              </NavLink>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2 border-t border-slate-100 mt-2">
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className={getMobileNavLinkClass}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-2.5 text-white font-semibold bg-red-500 hover:bg-red-600 rounded-xl shadow-md transition-colors"
              >
                Donate Now
              </NavLink>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
