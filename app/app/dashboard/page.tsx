import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CommandCenterMap } from "@/components/command-center/command-center-map";
import { ChatAgent } from "@/components/command-center/chat-agent";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold text-teal-400">
            UAE Transit Navigator
          </h1>
          <p className="text-xs text-slate-400">RTA Command Center</p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="text-sm text-slate-400">
            {user.email}
          </div>
        </div>
      </header>

      {/* Main content - 25% Sidebar / 75% Map */}
      <div className="flex-1 grid grid-cols-[25%_75%] overflow-hidden">
        {/* Left sidebar - AI Chat Agent */}
        <aside className="h-full">
          <ChatAgent />
        </aside>

        {/* Main map area */}
        <main className="h-full relative">
          <CommandCenterMap />
        </main>
      </div>
    </div>
  );
}
