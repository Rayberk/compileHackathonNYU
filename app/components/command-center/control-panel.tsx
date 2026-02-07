"use client";
import { useState } from "react";
import { Layers, Zap, Globe, AlertTriangle } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

interface ControlButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface ControlPanelProps {
  onMaintenanceToggle?: (active: boolean) => void;
  onCityChange?: (city: "dubai" | "abu-dhabi") => void;
}

function ControlButton({ icon, label, active, onClick }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
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

export function ControlPanel({ onMaintenanceToggle, onCityChange }: ControlPanelProps) {
  const [heatmapActive, setHeatmapActive] = useState(true);
  const [mlActive, setMlActive] = useState(false);
  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [activeCity, setActiveCity] = useState<'dubai' | 'abu-dhabi'>('dubai');

  const handleMaintenanceToggle = () => {
    const newState = !maintenanceActive;
    setMaintenanceActive(newState);
    onMaintenanceToggle?.(newState);
  };

  const handleCityChange = (city: 'dubai' | 'abu-dhabi') => {
    setActiveCity(city);
    onCityChange?.(city);
  };

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 max-w-[160px]">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-2 space-y-2">
        <ControlButton
          icon={<Layers className="w-4 h-4" />}
          label="Toggle Heatmap"
          active={heatmapActive}
          onClick={() => setHeatmapActive(!heatmapActive)}
        />
        <ControlButton
          icon={<Zap className="w-4 h-4" />}
          label="ML Prediction"
          active={mlActive}
          onClick={() => setMlActive(!mlActive)}
        />
        <ControlButton
          icon={<AlertTriangle className="w-4 h-4" />}
          label="Maintenance Alerts"
          active={maintenanceActive}
          onClick={handleMaintenanceToggle}
        />

        {/* City Switcher Section */}
        <div className="pt-2 border-t border-white/10">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
            <span>Region</span>
          </p>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => handleCityChange('dubai')}
              className={`px-2 py-1.5 rounded-md text-xs transition-all ${
                activeCity === 'dubai'
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
              }`}
            >
              <span>Dubai</span>
            </button>
            <button
              onClick={() => handleCityChange('abu-dhabi')}
              className={`px-2 py-1.5 rounded-md text-xs transition-all ${
                activeCity === 'abu-dhabi'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
              }`}
            >
              <span>Abu Dhabi</span>
            </button>
          </div>
        </div>

        <div className="pt-1.5 border-t border-white/10">
          <div className="scale-[0.65] origin-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
