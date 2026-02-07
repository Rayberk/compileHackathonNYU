"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MapPin, Zap, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { findHotspotsTool } from "@/lib/agent/tools";

interface Session {
  id: string;
  name: string;
  icon: React.ReactNode;
  active: boolean;
}

interface Message {
  id: string;
  text?: string;
  sender: "user" | "agent";
  timestamp: Date;
  type?: "text" | "ml-prediction";
  mlData?: {
    location: string;
    confidence: number;
    predictions: Array<{ label: string; value: number }>;
  };
}

interface SessionMessages {
  [sessionId: string]: Message[];
}

const SESSIONS: Session[] = [
  { id: "1", name: "Business Bay", icon: <MapPin className="w-4 h-4" />, active: true },
  { id: "2", name: "Reem Island", icon: <Zap className="w-4 h-4" />, active: false },
  { id: "3", name: "Marina", icon: <MessageSquare className="w-4 h-4" />, active: false },
];

const MOCK_RESPONSES = [
  { text: "I've identified 3 high-density areas in Business Bay that need additional stops." },
  {
    text: "Running ML prediction for this corridor...",
    mlData: {
      location: "Al Mustaqbal Street",
      confidence: 87,
      predictions: [
        { label: "Peak Hour Demand", value: 92 },
        { label: "AC Shelter Priority", value: 78 },
        { label: "Route Efficiency", value: 85 },
      ],
    },
  },
];

export function ChatAgent() {
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [sessionMessages, setSessionMessages] = useState<SessionMessages>({
    '1': [{ // Business Bay
      id: '1',
      text: 'Hi! I\'m your Business Bay transit planning assistant. Ask me about stop placement, hotspot analysis, or route optimization.',
      sender: 'agent',
      timestamp: new Date(),
      type: 'text'
    }],
    '2': [{ // Reem Island
      id: '1',
      text: 'Hi! I\'m your Reem Island transit planning assistant. Ask me about Abu Dhabi infrastructure, E11 routes, or local development needs.',
      sender: 'agent',
      timestamp: new Date(),
      type: 'text'
    }],
    '3': [{ // Marina
      id: '1',
      text: 'Hi! I\'m your Marina transit planning assistant. Ask me about coastal transit, beach access, or marina-specific needs.',
      sender: 'agent',
      timestamp: new Date(),
      type: 'text'
    }]
  });
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [mapSynced, setMapSynced] = useState(true);

  // Get active session and its messages
  const activeSession = sessions.find(s => s.active);
  const messages = sessionMessages[activeSession?.id || '1'] || [];

  const handleSessionSwitch = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => ({ ...s, active: s.id === sessionId }))
    );
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const activeSessionId = sessions.find(s => s.active)?.id || '1';
    const inputLower = input.toLowerCase();

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setSessionMessages(prev => ({
      ...prev,
      [activeSessionId]: [...(prev[activeSessionId] || []), userMessage]
    }));
    setInput("");
    setIsThinking(true);

    // Simple keyword detection for tool invocation
    const shouldCallHotspots = inputLower.includes('hotspot') ||
                              inputLower.includes('gap') ||
                              inputLower.includes('underserved');

    try {
      let responseText: string;
      let mlData: any = undefined;

      if (shouldCallHotspots) {
        // Call the actual database function
        responseText = await findHotspotsTool.execute({
          radius_meters: 500,
          min_pings: 10
        });
      } else {
        // Fall back to mock responses with delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
        responseText = response.text;
        mlData = response.mlData;
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "agent",
        timestamp: new Date(),
        type: mlData ? "ml-prediction" : "text",
        mlData: mlData,
      };

      setSessionMessages(prev => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), agentMessage]
      }));
    } catch (error) {
      console.error('Agent tool error:', error);
      // Fallback to mock response on error
      const response = MOCK_RESPONSES[0];
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text || "I encountered an error processing your request. Please try again.",
        sender: "agent",
        timestamp: new Date(),
        type: "text",
      };
      setSessionMessages(prev => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), agentMessage]
      }));
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="h-full bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Session Switcher */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-3">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => handleSessionSwitch(session.id)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                session.active
                  ? "bg-teal-500/20 border border-teal-500/30 text-teal-400"
                  : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10"
              }`}
              title={session.name}
            >
              {session.icon}
            </button>
          ))}
        </div>

        {/* Active Session Info */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">
              <span>{sessions.find((s) => s.active)?.name || "Business Bay"}</span>
            </h2>
            <p className="text-xs text-slate-400">
              <span>AI Planning Session</span>
            </p>
          </div>

          {/* Map Sync Indicator */}
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${mapSynced ? "bg-emerald-400" : "bg-slate-600"}`} />
            <span className="text-xs text-slate-400">
              <span>{mapSynced ? "Map Synced" : "Syncing..."}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSession?.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.type === "ml-prediction" && message.mlData ? (
              // Rich ML Prediction Card
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[90%] bg-gradient-to-br from-indigo-500/10 to-teal-500/10 border border-indigo-500/20 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-indigo-400 font-medium uppercase tracking-wider">
                      <span>ML Prediction</span>
                    </p>
                    <p className="text-sm text-white mt-1">
                      <span>{message.mlData.location}</span>
                    </p>
                  </div>
                  <div className="px-2 py-1 bg-teal-500/20 rounded-full">
                    <span className="text-xs font-semibold text-teal-400">
                      {message.mlData.confidence}% confidence
                    </span>
                  </div>
                </div>

                {/* Prediction Bars */}
                <div className="space-y-2">
                  {message.mlData.predictions.map((pred, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">{pred.label}</span>
                        <span className="text-white font-medium">{pred.value}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pred.value}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </motion.div>
            ) : (
              // Regular Text Bubble
              <div
                className={`max-w-[85%] rounded-2xl p-3 ${
                  message.sender === "user"
                    ? "bg-gradient-to-br from-indigo-600 to-indigo-500 text-white"
                    : "bg-white/5 text-slate-200 border border-white/10"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        ))}{/* Thinking Indicator */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-teal-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-teal-400" />
                  </div>
                  {/* Siri-style Glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/40 to-teal-500/40 blur-md"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <span className="text-sm text-slate-400">
                  <span>Analyzing transit patterns...</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about transit planning..."
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-teal-500/50"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-gradient-to-br from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white border-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Powered By Row */}
        <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">
            <span>Powered by</span>
          </p>
          <p className="text-xs text-white/40 font-semibold">
            <span>Lingo.dev + Next.js</span>
          </p>
        </div>
      </div>
    </div>
  );
}
