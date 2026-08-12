import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, MapPin, Droplet, Phone, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const SearchDonors = () => {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    bloodGroup: '',
    city: '',
  })

  const fetchDonors = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (filters.bloodGroup)
        queryParams.append('bloodGroup', filters.bloodGroup)
      if (filters.city) queryParams.append('city', filters.city)

      const { data } = await axios.get(
        `/api/donors?${queryParams.toString()}`,
      )
      // Backend wraps: { success, message, data: { donors, pagination } }
      setDonors(data.data?.donors ?? [])
    } catch (error) {
      console.error('Error fetching donors:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch with debounce to prevent too many calls on typing
    const timeoutId = setTimeout(() => {
      fetchDonors()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Find Blood Donors
          </h1>
          <p className="text-lg text-slate-600">
            Search for available blood donors near your location.
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-10 mx-auto max-w-4xl flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Droplet className="h-5 w-5 text-red-400" />
            </div>
            <select
              name="bloodGroup"
              value={filters.bloodGroup}
              onChange={handleFilterChange}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-red-500 focus:border-red-500 bg-slate-50"
            >
              <option value="">Any Blood Group</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Enter City"
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-red-500 focus:border-red-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : donors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor, index) => (
              <motion.div
                key={donor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-red-500 text-white font-bold py-1 px-4 rounded-bl-lg">
                  {donor.bloodGroup}
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-xl font-bold">
                    {donor.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {donor.fullName}
                    </h3>
                    <p className="text-slate-500 flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" /> {donor.city}, {donor.state}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-6 text-sm text-slate-600">
                  <p>
                    <strong>Age:</strong> {donor.age} | <strong>Gender:</strong>{' '}
                    {donor.gender}
                  </p>
                  <p className="line-clamp-1">
                    <strong>Location:</strong> {donor.address}
                  </p>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`tel:${donor.mobileNumber}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors"
                  >
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <a
                    href={`https://wa.me/${donor.mobileNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-700 mb-2">
              No Donors Found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search criteria to find available donors.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchDonors
