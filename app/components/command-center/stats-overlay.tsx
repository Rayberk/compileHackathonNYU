"use client";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  colorClass: string;
}

function StatCard({ title, value, colorClass }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-4 rounded-lg text-center ${colorClass}`}
    >
      <p className="text-xs font-bold uppercase tracking-wider opacity-80">
        {title}
      </p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </motion.div>
  );
}

export function StatsOverlay() {
  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Active Routes"
          value={142}
          colorClass="bg-teal-500/90 text-teal-50 backdrop-blur-sm"
        />
        <StatCard
          title="Hotspots"
          value={12}
          colorClass="bg-amber-500/90 text-amber-50 backdrop-blur-sm"
        />
      </div>
    </div>
  );
}
