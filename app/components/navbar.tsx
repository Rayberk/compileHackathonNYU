"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";

interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface NavItem {
  name: string;
  items: DropdownItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Solutions",
    items: [
      { label: "Heatmap Analytics", href: "#" },
      { label: "Infrastructure Gaps", href: "#" },
      { label: "ML Predictions", href: "#" },
    ],
  },
  {
    name: "Regions",
    items: [
      { label: "Dubai - Business Bay", href: "#" },
      { label: "Abu Dhabi - Reem Island", href: "#" },
    ],
  },
  {
    name: "Resources",
    items: [
      { label: "Data Sources", href: "#" },
      { label: "API Docs", href: "#" },
      { label: "RTA Guidelines", href: "#" },
    ],
  },
];

export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const handleDropdownToggle = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
            <span>UAE Transit</span>
          </h1>
        </Link>

        {/* Navigation Items with Dropdowns */}
        <div className="flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <div key={item.name} className="relative">
              <button
                onClick={(e) => handleDropdownToggle(item.name, e)}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  activeDropdown === item.name
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <span>{item.name}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === item.name ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {activeDropdown === item.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl z-60"
                  >
                    {item.items.map((dropdownItem, idx) => (
                      <Link
                        key={idx}
                        href={dropdownItem.href || "#"}
                        className="block px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                      >
                        <span>{dropdownItem.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Action Area */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/dashboard">
            <button className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-semibold hover:opacity-80 transition-opacity">
              <span>Launch App</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
