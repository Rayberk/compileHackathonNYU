import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CommandCenterMap } from "@/components/command-center/command-center-map";
import { ChatAgent } from "@/components/command-center/chat-agent";
import { InsightsTray } from "@/components/command-center/insights-tray";

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
    <div className="fixed inset-0 bg-black flex overflow-hidden">
      {/* Left Sidebar - Chat Agent with Session Switcher (25%) */}
      <aside className="w-1/4 h-full overflow-hidden">
        <ChatAgent />
      </aside>

      {/* Main Canvas - Map with Overlays (75%) */}
      <main className="flex-1 h-full relative overflow-hidden">
        {/* Mapbox Map */}
        <CommandCenterMap />

        {/* Bottom Insights Tray */}
        <InsightsTray />
      </main>
    </div>
  );
}
