"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, LogOut, Settings } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { createClient } from "@/lib/supabase/client";

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
      { label: "Heatmap Analytics", href: "/dashboard" },
      { label: "Infrastructure Gaps", href: "/dashboard" },
      { label: "ML Predictions", href: "/dashboard" },
    ],
  },
  {
    name: "Regions",
    items: [
      { label: "Dubai - Business Bay", href: "/dashboard" },
      { label: "Abu Dhabi - Reem Island", href: "/dashboard" },
    ],
  },
  {
    name: "Resources",
    items: [
      { label: "Data Sources", href: "/dashboard" },
      { label: "API Docs", href: "/dashboard" },
      { label: "RTA Guidelines", href: "https://www.rta.ae" },
    ],
  },
];

export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleDropdownToggle = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
      setAccountDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="relative z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="TransitUAE Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
            <span>TransitUAE</span>
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
                    className="absolute top-full left-0 mt-2 w-64 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl z-40"
                  >
                    {item.items.map((dropdownItem, idx) => (
                      <Link
                        key={idx}
                        href={dropdownItem.href || "#"}
                        onClick={(e) => {
                          if (dropdownItem.onClick) {
                            e.preventDefault();
                            dropdownItem.onClick();
                          }
                          setActiveDropdown(null);
                        }}
                        target={dropdownItem.href?.startsWith('http') ? '_blank' : undefined}
                        rel={dropdownItem.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
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

          {user ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAccountDropdownOpen(!accountDropdownOpen);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-sm transition-colors border border-white/10"
              >
                <User className="w-4 h-4" />
                <span>{user.email?.split('@')[0] || 'Account'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${accountDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Account Dropdown */}
              <AnimatePresence>
                {accountDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl z-40"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
                        <span>Signed in as</span>
                      </p>
                      <p className="text-sm text-white font-medium truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 mt-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/auth/login">
              <button className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-semibold hover:opacity-80 transition-opacity">
                <span>Launch App</span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
