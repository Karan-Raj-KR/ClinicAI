"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

export default function BookingBot() {
  const [messages, setMessages] = useState([
    { text: "Hello! Welcome to ClinicAI. I can help you book an appointment. To get started, what is the patient's name?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(1); // 1: Name, 2: Date, 3: Doctor, 4: Done
  const [bookingData, setBookingData] = useState({ name: "", date: "", doctor: "" });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");

    // Simple delay for bot response
    setTimeout(() => {
      let botResponse = "";
      
      if (step === 1) {
        setBookingData(prev => ({ ...prev, name: userMessage }));
        botResponse = `Nice to meet you, ${userMessage}. When would you like the appointment? (e.g. Tomorrow morning, May 20th)`;
        setStep(2);
      } else if (step === 2) {
        setBookingData(prev => ({ ...prev, date: userMessage }));
        botResponse = `Got it. Which doctor would you prefer? We have Dr. Sharma (General) and Dr. Gupta (Specialist) available.`;
        setStep(3);
      } else if (step === 3) {
        botResponse = `Perfect! Your appointment is confirmed with ${userMessage} for ${bookingData.date}. We'll send a reminder to ${bookingData.name} soon! \n\nType "restart" if you want to book another.`;
        setStep(4);
      } else {
        if (userMessage.toLowerCase() === "restart") {
          botResponse = "Let's start over. What is the patient's name?";
          setStep(1);
          setBookingData({ name: "", date: "", doctor: "" });
        } else {
          botResponse = "Your appointment is already booked! Type 'restart' to book another.";
        }
      }

      setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
    }, 600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--gray-50)", borderRadius: "var(--radius-lg)", border: "1px solid var(--gray-200)", overflow: "hidden" }}>
      
      {/* Chat Header */}
      <div style={{ background: "var(--teal-600)", padding: "1rem", color: "white", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ background: "rgba(255,255,255,0.2)", padding: "0.5rem", borderRadius: "var(--radius-full)" }}>
          <Bot size={20} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: "1rem", fontFamily: "Outfit, sans-serif" }}>Booking Assistant</h3>
          <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.8 }}>Online</p>
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

      {/* Input Area */}
      <form onSubmit={handleSend} style={{ display: "flex", padding: "1rem", background: "var(--white)", borderTop: "1px solid var(--gray-200)", gap: "0.5rem" }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="Type a message..." 
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
