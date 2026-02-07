"use client";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

function MetricCard({ title, value, subtitle, color }: MetricCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-2">
      <p className="text-xs text-slate-400 uppercase tracking-wider">
        <span>{title}</span>
      </p>
      <p className={`text-4xl font-bold ${color}`}>
        <span>{value}</span>
      </p>
      <p className="text-sm text-slate-500">
        <span>{subtitle}</span>
      </p>
    </div>
  );
}

export function InsightsTray() {
  return (
    <motion.div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-5xl px-6"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
    >
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          title="Demand Heat"
          value="87%"
          subtitle="High commuter density detected"
          color="text-teal-400"
        />
        <MetricCard
          title="Infrastructure Gap"
          value="23%"
          subtitle="Commuters without AC shelter access"
          color="text-amber-400"
        />
        <MetricCard
          title="Optimization Score"
          value="92/100"
          subtitle="Overall city efficiency rating"
          color="text-emerald-400"
        />
      </div>
    </motion.div>
  );
}
