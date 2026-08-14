import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import {
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  Hospital,
  HeartPulse,
  Plus,
} from 'lucide-react'
import { motion } from 'framer-motion'

const EmergencyRequests = () => {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroupRequired: 'A+',
    unitsRequired: 1,
    urgency: 'High',
    hospitalName: '',
    hospitalAddress: '',
    city: '',
    state: '',
    contactNumber: '',
  })

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/requests')
      // Backend wraps: { success, message, data: { requests, pagination } }
      setRequests(data.data?.requests ?? [])
    } catch (error) {
      console.error('Failed to fetch requests', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRequests()
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/requests', formData)
      setShowForm(false)
      setFormData({
        patientName: '',
        bloodGroupRequired: 'A+',
        unitsRequired: 1,
        urgency: 'High',
        hospitalName: '',
        hospitalAddress: '',
        city: '',
        state: '',
        contactNumber: '',
      })
      fetchRequests() // Refresh the list
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit request')
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-red-600 text-white'
      case 'High':
        return 'bg-orange-500 text-white'
      case 'Medium':
        return 'bg-yellow-400 text-slate-900'
      default:
        return 'bg-blue-500 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
              <AlertCircle className="w-10 h-10 text-red-500" />
              Emergency Requests
            </h1>
            <p className="text-slate-600">
              Urgent blood requirements in your area. Help save a life today.
            </p>
          </div>
          {user ? (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition shadow-sm"
            >
              <Plus className="w-5 h-5" />
              {showForm ? 'Cancel Request' : 'Create Emergency Request'}
            </button>
          ) : (
            <p className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100">
              Please login to create an emergency request.
            </p>
          )}
        </div>

        {/* Create Request Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white p-6 rounded-2xl shadow-md border border-red-100 mb-10 overflow-hidden"
          >
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
              Post Urgent Requirement
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Blood Group Needed
                </label>
                <select
                  name="bloodGroupRequired"
                  value={formData.bloodGroupRequired}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Units Required
                </label>
                <input
                  type="number"
                  min="1"
                  name="unitsRequired"
                  value={formData.unitsRequired}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Urgency
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500"
                >
                  <option value="Critical">Critical (Within hours)</option>
                  <option value="High">High (Within 24 hours)</option>
                  <option value="Medium">Medium (Within a few days)</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Hospital Name
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Hospital Address
                </label>
                <input
                  type="text"
                  name="hospitalAddress"
                  value={formData.hospitalAddress}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500"
                />
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
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500"
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
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-red-500"
                />
              </div>
              <div className="md:col-span-3 flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md"
                >
                  Broadcast Emergency
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Listing */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : requests.length > 0 ? (
          <div className="space-y-6">
            {requests.map((req, index) => (
              <motion.div
                key={req._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center"
              >
                {/* Left Badges */}
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl min-w-[150px]">
                  <HeartPulse className="w-10 h-10 text-red-500 mb-2" />
                  <span className="text-3xl font-extrabold text-slate-900">
                    {req.bloodGroupRequired}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {req.unitsRequired} Unit(s)
                  </span>
                </div>

                {/* Body */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-slate-800">
                      {req.patientName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getUrgencyColor(req.urgency)}`}
                    >
                      {req.urgency}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 mt-4 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <Hospital className="w-4 h-4 text-slate-400" />{' '}
                      {req.hospitalName}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />{' '}
                      {req.hospitalAddress}, {req.city}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />{' '}
                      {req.contactNumber}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" /> Posted:{' '}
                      {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="w-full md:w-auto">
                  <a
                    href={`tel:${req.contactNumber}`}
                    className="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition border border-red-200"
                  >
                    <Phone className="w-5 h-5" /> I Can Donate
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-700 mb-2">
              No Active Emergencies
            </h3>
            <p className="text-slate-500">
              There are currently no active blood requests in the network.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmergencyRequests
