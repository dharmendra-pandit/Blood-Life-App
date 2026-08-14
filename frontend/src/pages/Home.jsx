import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Activity, Search, ShieldCheck } from 'lucide-react'

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-50 to-white -z-10" />
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
                Donate Blood, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500">
                  Save Lives
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 mb-10"
            >
              Join our community of life-savers. Every drop counts. Whether you
              need blood or want to donate, we connect you with the right people
              instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/register"
                className="px-8 py-4 text-white font-semibold rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" /> Be a Donor
              </Link>
              <Link
                to="/search"
                className="px-8 py-4 text-slate-700 font-semibold rounded-full bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" /> Find Blood
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-y border-slate-100 py-12">
            <motion.div whileHover={{ scale: 1.05 }} className="p-6">
              <div className="text-4xl font-extrabold text-red-500 mb-2">
                1,240+
              </div>
              <div className="text-slate-500 font-medium font-medium">
                Registered Donors
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="p-6">
              <div className="text-4xl font-extrabold text-red-500 mb-2">
                8,530+
              </div>
              <div className="text-slate-500 font-medium">Lives Saved</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="p-6">
              <div className="text-4xl font-extrabold text-red-500 mb-2">
                150+
              </div>
              <div className="text-slate-500 font-medium">Cities Covered</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features / How it works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-slate-600">
              Our platform makes it incredibly easy to request or donate blood
              in times of emergency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                1. Create Profile
              </h3>
              <p className="text-slate-600">
                Register with your blood group and location. Your data is kept
                secure and private.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                2. Search or Request
              </h3>
              <p className="text-slate-600">
                Filter donors by city and blood type, or create an urgent
                emergency request.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <Activity className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                3. Connect Instantly
              </h3>
              <p className="text-slate-600">
                Contact matching donors directly via phone or WhatsApp to save a
                life locally.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
