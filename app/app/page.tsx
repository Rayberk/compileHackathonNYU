"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const words = [
    "Offering",
    "intelligent",
    "transportation",
    "optimization",
    "systems.",
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMDQsIDI1MSwgMjQxLCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

      <Navbar />

      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="space-y-8">
              {/* Animated Heading */}
              <div className="space-y-4">
                <motion.h1
                  className="text-6xl lg:text-7xl font-bold leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {words.map((word, index) => (
                    <motion.span
                      key={index}
                      className="inline-block mr-3 bg-gradient-to-r from-teal-400 via-blue-500 to-teal-400 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h1>

                <motion.p
                  className="text-xl text-slate-400 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  Empowering RTA planners with PostGIS-driven insights for Dubai
                  and Abu Dhabi.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Link href="/dashboard">
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg font-semibold text-white shadow-lg shadow-teal-500/50 flex items-center gap-2 hover:shadow-teal-500/70 transition-shadow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Enter Command Center</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>

                <Link href="#features">
                  <motion.button
                    className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Documentation
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-6 pt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-teal-400">142</div>
                  <div className="text-sm text-slate-500">Active Routes</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-blue-400">600+</div>
                  <div className="text-sm text-slate-500">AC Shelters</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-amber-400">12</div>
                  <div className="text-sm text-slate-500">Hotspots</div>
                </div>
              </motion.div>
            </div>

            {/* Right: 3D Map Placeholder */}
            <motion.div
              className="relative h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              {/* Map Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-teal-500/30">
                    <svg
                      className="w-12 h-12 text-teal-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Interactive 3D Transit Map
                  </p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-4 right-4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Strategic Districts Section */}
      <section id="features" className="relative py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                Strategic Districts
              </span>
            </h2>
            <p className="text-slate-400 text-lg">
              Data-Driven Transit Intelligence for the Emirates
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Business Bay */}
            <motion.div
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-teal-500/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Business Bay Optimization
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Solving last-mile connectivity in Dubai's densest commercial
                hub. Advanced hotspot analysis for peak commuter density zones.
              </p>
            </motion.div>

            {/* Reem Island */}
            <motion.div
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏝️</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Reem Island Growth
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Data-backed routing for Abu Dhabi's 210,000+ future residents.
                Predictive infrastructure planning for sustainable growth.
              </p>
            </motion.div>

            {/* AC Shelters */}
            <motion.div
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">❄️</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Smart AC Shelters
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Visualizing the 600-stop climate-controlled rollout across the
                E11 corridor. Temperature-optimized placement strategy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            Built for the RTA Dubai Hackathon • Powered by Next.js, Supabase &
            PostGIS
          </p>
        </div>
      </footer>
    </main>
  );
}
