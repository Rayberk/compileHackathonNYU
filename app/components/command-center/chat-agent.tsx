"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

const MOCK_RESPONSES = [
  "I've identified 3 high-density areas in Business Bay that need additional stops.",
  "Based on the heatmap, the corridor near Al Mustaqbal Street shows significant commuter activity.",
  "AC Shelter placement recommended at coordinates 25.2048, 55.2708.",
  "Current analysis shows 12 hotspots with insufficient coverage.",
];

export function ChatAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your transit planning assistant. Ask me about stop placement, hotspot analysis, or route optimization.",
      sender: "agent",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Mock agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)],
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="h-full bg-slate-900/80 backdrop-blur-lg border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold text-teal-400">AI Planning Agent</h2>
        <p className="text-xs text-slate-400 mt-1">
          Transit optimization assistant
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-800 text-slate-200"
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
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about transit planning..."
            className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
