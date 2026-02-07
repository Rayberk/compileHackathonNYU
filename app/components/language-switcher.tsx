"use client";
import { useLingoContext } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLingoContext();

  const handleChange = async (newLocale: string) => {
    await setLocale(newLocale);
  };

  return (
    <div className="flex items-center space-x-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Language:
      </span>
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer text-slate-700 dark:text-slate-200"
      >
        <option value="en">English (EN)</option>
        <option value="ar">العربية (AR)</option>
      </select>
    </div>
  );
}
