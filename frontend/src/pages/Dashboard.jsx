import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { Save, UserCircle } from 'lucide-react'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Male',
    age: '',
    bloodGroup: 'A+',
    mobileNumber: '',
    city: '',
    state: '',
    address: '',
    isAvailable: true,
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/donors/profile')
        // Backend wraps: { success, message, data }
        setProfile(data.data)
        setFormData(data.data)
      } catch {
        console.log('No profile found, user needs to create one.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const { data } = await axios.post('/api/donors/profile', formData)
      // Backend wraps: { success, message, data }
      setProfile(data.data)
      setMessage('Profile saved successfully!')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving profile')
    }
  }

  if (loading) return <div className="text-center mt-20">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <UserCircle className="w-8 h-8 text-red-500" />
          Welcome, {user?.name}
        </h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-md font-medium text-slate-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-6 border-b pb-4">
          Your Donor Profile
        </h2>

        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Age
            </label>
            <input
              type="number"
              name="age"
              min="18"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500 focus:border-red-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Blood Group
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500 focus:border-red-500"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              id="isAvailable"
              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label
              htmlFor="isAvailable"
              className="ml-2 block text-sm text-gray-900"
            >
              I am currently available to donate blood
            </label>
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition shadow-sm w-full md:w-auto justify-center"
            >
              <Save className="w-5 h-5" /> Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Dashboard
