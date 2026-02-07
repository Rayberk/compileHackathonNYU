"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="bg-black text-white overflow-hidden">
      <Navbar />

      {/* Section 1: The Hero - The Vision */}
      <section className="relative h-screen flex items-center justify-center px-6">
        {/* Blurred Burj Khalifa background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-2xl"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='1920' height='1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2314b8a6;stop-opacity:0.3' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23grad)' /%3E%3C/svg%3E')"
          }}
        />

        <div className="relative z-10 text-center max-w-5xl">
          <motion.h1
            className="text-7xl lg:text-8xl font-bold tracking-tighter mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-white">Offering intelligent transportation optimization systems.</span>
          </motion.h1>

          <motion.p
            className="text-2xl text-white/70 font-light"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span>The future of Dubai's transit, powered by PostGIS and Human-Centric AI.</span>
          </motion.p>
        </div>
      </section>

      {/* Section 2: The Command Center - Interactive Map */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-6xl lg:text-7xl font-bold tracking-tighter mb-16 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-white">The City. In real-time.</span>
          </motion.h2>

          <motion.div
            className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-white/10 backdrop-blur-xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Glass container mock */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-teal-500/20 to-amber-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="text-lg text-white/60"><span>Business Bay</span> <span className="text-teal-400">•</span> <span>Reem Island</span></p>
                  <div className="flex items-center justify-center gap-4 text-sm text-white/40">
                    <span>142 Routes</span>
                    <span>•</span>
                    <span>600 Shelters</span>
                    <span>•</span>
                    <span>12 Hotspots</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="text-center text-xl text-white/60 mt-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <span>Total visibility into every bus stop, shelter, and commuter ping across the Emirates.</span>
          </motion.p>
        </div>
      </section>

      {/* Section 3: The AI Planner - The Agent */}
      <section className="relative py-32 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-6xl lg:text-7xl font-bold tracking-tighter mb-16 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-white">Intelligence on speed.</span>
          </motion.h2>

          <motion.div
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Chat bubble mockup */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">AI</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-white/90 text-lg"><span>"Agent, where are the AC shelter gaps in Reem Island?"</span></p>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <p className="text-white/70"><span>Analyzing 3,247 commuter pings in Reem Island district...</span></p>
                      <p className="text-white mt-3"><span>I've identified 4 high-density zones without AC shelter coverage within 500m radius. Coordinates: 25.2048, 55.2708...</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="text-center text-xl text-white/60 mt-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <span>Google Agent SDK integration that predicts transit demand patterns using ML models.</span>
          </motion.p>
        </div>
      </section>

      {/* Section 4: Multi-Context Workflow - The Sidebar */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-6xl lg:text-7xl font-bold tracking-tighter mb-16 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-white">Never lose your train of thought.</span>
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Chat Window 1 */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-6 hover:border-teal-500/30 transition-all">
              <div className="space-y-3">
                <div className="w-8 h-1 bg-teal-500 rounded-full" />
                <h3 className="text-lg font-semibold text-white"><span>Business Bay Planning</span></h3>
                <p className="text-sm text-white/50"><span>37 messages</span></p>
              </div>
            </div>

            {/* Chat Window 2 */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
              <div className="space-y-3">
                <div className="w-8 h-1 bg-amber-500 rounded-full" />
                <h3 className="text-lg font-semibold text-white"><span>AC Shelter Deployment</span></h3>
                <p className="text-sm text-white/50"><span>22 messages</span></p>
              </div>
            </div>

            {/* Chat Window 3 */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
              <div className="space-y-3">
                <div className="w-8 h-1 bg-blue-500 rounded-full" />
                <h3 className="text-lg font-semibold text-white"><span>Reem Island Routes</span></h3>
                <p className="text-sm text-white/50"><span>15 messages</span></p>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="text-center text-xl text-white/60 mt-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <span>Multiple planning contexts, seamlessly organized. Switch between projects without losing your flow.</span>
          </motion.p>
        </div>
      </section>

      {/* Section 5: Local Roots - Lingo.dev */}
      <section className="relative py-32 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-6xl lg:text-7xl font-bold tracking-tighter mb-16 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-white">Built for the UAE.</span>
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* English View */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40 uppercase tracking-wider"><span>English</span></span>
                  <div className="px-2 py-1 bg-teal-500/20 rounded-full">
                    <span className="text-xs text-teal-400">EN</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white"><span>Active Routes</span></h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">142</span>
                  <span className="text-lg text-white/40">routes</span>
                </div>
              </div>
            </div>

            {/* Arabic View */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-8">
              <div className="space-y-4 text-right" dir="rtl">
                <div className="flex items-center justify-between">
                  <div className="px-2 py-1 bg-amber-500/20 rounded-full">
                    <span className="text-xs text-amber-400">AR</span>
                  </div>
                  <span className="text-xs text-white/40 uppercase tracking-wider"><span>العربية</span></span>
                </div>
                <h3 className="text-2xl font-bold text-white"><span>الطرق النشطة</span></h3>
                <div className="flex items-baseline gap-2 justify-end">
                  <span className="text-lg text-white/40">طريق</span>
                  <span className="text-5xl font-bold text-white">142</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="text-center text-xl text-white/60 mt-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <span>Zero-latency localization using Lingo.dev's build-time transformations. Instant switching between Arabic and English.</span>
          </motion.p>
        </div>
      </section>

      {/* Section 6: The Call to Action - The Gateway */}
      <section className="relative py-48 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-7xl lg:text-8xl font-bold tracking-tighter mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-white">Optimize the Future.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/dashboard">
              <motion.button
                className="px-12 py-6 bg-white text-black rounded-full text-xl font-semibold hover:bg-white/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Launch Command Center</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Footer Links */}
          <motion.div
            className="mt-24 pt-12 border-t border-white/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-8 text-sm text-white/40">
              <a href="https://www.rta.ae" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">
                <span>RTA Dubai</span>
              </a>
              <span>•</span>
              <a href="https://admobility.gov.ae" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">
                <span>Abu Dhabi ITC</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
