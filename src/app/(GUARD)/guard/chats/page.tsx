"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Send, Shield, Radio, CheckCheck, User, Building2, AlertCircle } from "lucide-react";

interface ChatMsg {
  id: string;
  sender: "guard" | "dispatch" | "police" | "resident";
  senderName: string;
  text: string;
  time: string;
}

const DEFAULT_MESSAGES: ChatMsg[] = [
  {
    id: "m1",
    sender: "dispatch",
    senderName: "Command Center (Officer Rao)",
    text: "Shift Alpha initiated for Sector 4. Please report checkpoint status after completing round 1.",
    time: "22:00",
  },
  {
    id: "m2",
    sender: "guard",
    senderName: "Muhammad Tariq (Guard ID: GRD-101)",
    text: "Copy Command Center. West perimeter and ATM gates secured. Zero unauthorized vehicles observed.",
    time: "22:15",
  },
  {
    id: "m3",
    sender: "police",
    senderName: "Patrol Unit 9 (Police Liaison)",
    text: "Be advised: Vehicle inspection active near Highway Junction. Keep radio open on Channel 4.",
    time: "22:30",
  },
];

export default function GuardChat() {
  const session = useSession();
  const guardName = session.data?.user?.name || "Muhammad Tariq (Guard ID: GRD-101)";
  const [messages, setMessages] = useState<ChatMsg[]>(DEFAULT_MESSAGES);
  const [inputMessage, setInputMessage] = useState("");
  const [channel, setChannel] = useState<"Command" | "Police" | "Resident">("Command");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMsg = {
      id: `m-${Date.now()}`,
      sender: "guard",
      senderName: `${guardName} (You)`,
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    const currentInput = inputMessage.trim();
    setInputMessage("");

    // Automated Command Response for realistic interactive flow
    setTimeout(() => {
      const responseMsg: ChatMsg = {
        id: `resp-${Date.now()}`,
        sender: channel === "Police" ? "police" : "dispatch",
        senderName: channel === "Police" ? "Police Dispatch Unit 9" : "Command Center (HQ)",
        text: `Acknowledged: "${currentInput}". Position logged at Sector 4 Perimeter. Maintain vigilance.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, responseMsg]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[700px]">
        {/* Chat Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg">Tactical Operations Radio & Chat</h2>
              <p className="text-xs text-slate-400">Secure end-to-end telemetry • Sector 4 Security Link</p>
            </div>
          </div>

          <div className="flex gap-1.5">
            {(["Command", "Police", "Resident"] as const).map((ch) => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  channel === ch
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Feed */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/60"
        >
          {messages.map((msg) => {
            const isMe = msg.sender === "guard";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <span className="text-[11px] font-semibold text-gray-500 mb-1 px-1">
                  {msg.senderName}
                </span>
                <div
                  className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-sm shadow-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-xs"
                      : msg.sender === "police"
                      ? "bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-bl-xs"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-xs"
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <div
                    className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${
                      isMe ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    <span>{msg.time}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Footer */}
        <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t border-gray-200 flex items-center gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-800 bg-gray-50 focus:bg-white transition"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Transmit message to ${channel === "Command" ? "Command Center" : channel === "Police" ? "Police Liaison" : "Resident Dispatch"}...`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Transmit</span>
          </button>
        </form>
      </div>
    </div>
  );
}
