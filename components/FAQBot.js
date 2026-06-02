"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Info } from "lucide-react";

export default function FAQBot() {
  const [messages, setMessages] = useState([
    { text: "Hello! I can answer questions about Dr. Sharma's Clinic, Bengaluru. Ask me about timings, doctors, or insurance!", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const clinicProfile = {
    timings: "We are open from 9 AM to 7 PM, Monday through Saturday. Closed on Sundays.",
    doctors: "We have Dr. Sharma (General Physician) and Dr. Gupta (Pediatrician) available.",
    insurance: "Yes, we accept most major health insurance plans, including HDFC ERGO, Star Health, and Bajaj Allianz.",
    location: "We are located at 123 Health Ave, Koramangala, Bengaluru.",
    default: "I'm sorry, I don't have the answer to that. You can ask me about timings, doctors, location, or insurance!"
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    if (msg.includes("timing") || msg.includes("time") || msg.includes("open") || msg.includes("hours")) {
      return clinicProfile.timings;
    }
    if (msg.includes("doctor") || msg.includes("who")) {
      return clinicProfile.doctors;
    }
    if (msg.includes("insurance") || msg.includes("claim") || msg.includes("policy")) {
      return clinicProfile.insurance;
    }
    if (msg.includes("location") || msg.includes("where") || msg.includes("address")) {
      return clinicProfile.location;
    }
    return clinicProfile.default;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");

    setTimeout(() => {
      const botResponse = getBotResponse(userMessage);
      setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
    }, 500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--gray-50)", borderRadius: "var(--radius-lg)", border: "1px solid var(--gray-200)", overflow: "hidden" }}>
      
      {/* Chat Header */}
      <div style={{ background: "var(--teal-600)", padding: "1rem", color: "white", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ background: "rgba(255,255,255,0.2)", padding: "0.5rem", borderRadius: "var(--radius-full)" }}>
          <Info size={20} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: "1rem", fontFamily: "Outfit, sans-serif" }}>Clinic FAQ</h3>
          <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.8 }}>Always here to help</p>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, padding: "1rem", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.sender} animate-fade-in`} style={{ whiteSpace: "pre-wrap" }}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div style={{ display: "flex", gap: "0.5rem", padding: "0.5rem 1rem", overflowX: "auto", borderTop: "1px solid var(--gray-200)", background: "var(--white)" }}>
        {["Timings?", "Which doctors?", "Insurance?"].map(q => (
          <button 
            key={q}
            onClick={() => setInput(q)}
            style={{ 
              whiteSpace: "nowrap", 
              padding: "0.4rem 0.8rem", 
              fontSize: "0.8rem", 
              borderRadius: "var(--radius-full)", 
              border: "1px solid var(--teal-200)", 
              color: "var(--teal-700)", 
              background: "var(--teal-50)" 
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} style={{ display: "flex", padding: "1rem", background: "var(--white)", borderTop: "1px solid var(--gray-200)", gap: "0.5rem" }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="Ask a question..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-primary" style={{ padding: "0.75rem", borderRadius: "var(--radius-full)" }} disabled={!input.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
