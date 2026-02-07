"use client";
import { useLingoContext } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLingoContext();

  const handleChange = async (newLocale: string) => {
    await setLocale(newLocale);
  };

  return (
    <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md p-2 rounded-lg border border-white/10">
      <span className="text-sm font-medium text-white/70">
        Language:
      </span>
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer text-white"
      >
        <option value="en" className="bg-black">English (EN)</option>
        <option value="ar" className="bg-black">العربية (AR)</option>
      </select>
    </div>
  );
}
