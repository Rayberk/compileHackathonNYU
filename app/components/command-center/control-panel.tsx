"use client";
import { useState } from "react";
import { Layers, Zap, Globe } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

interface ControlButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function ControlButton({ icon, label, active, onClick }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
        active
          ? "bg-teal-500/20 border border-teal-500/30"
          : "bg-white/5 border border-white/10 hover:bg-white/10"
      }`}
      title={label}
    >
      <div className={active ? "text-teal-400" : "text-white/70 group-hover:text-white"}>
        {icon}
      </div>
    </button>
  );
}

export function ControlPanel() {
  const [heatmapActive, setHeatmapActive] = useState(true);
  const [mlActive, setMlActive] = useState(false);

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 space-y-3">
        <ControlButton
          icon={<Layers className="w-5 h-5" />}
          label="Toggle Heatmap"
          active={heatmapActive}
          onClick={() => setHeatmapActive(!heatmapActive)}
        />
        <ControlButton
          icon={<Zap className="w-5 h-5" />}
          label="ML Prediction"
          active={mlActive}
          onClick={() => setMlActive(!mlActive)}
        />
        <div className="pt-2 border-t border-white/10">
          <div className="scale-75 origin-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
