"use client";

import { useState } from "react";
import BookingBot from "@/components/BookingBot";
import FAQBot from "@/components/FAQBot";
import VisitSummary from "@/components/VisitSummary";
import { MessageCircle, Stethoscope, FileText } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("booking");

  return (
    <main style={{ minHeight: "100vh", padding: "2rem", display: "flex", justifyContent: "center" }}>
      <div className="glass-card animate-fade-in" style={{ width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", height: "85vh" }}>
        
        <header style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ color: "var(--teal-700)" }}>ClinicAI</h1>
          <p style={{ color: "var(--gray-700)" }}>Smart Clinic Assistant</p>
        </header>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", background: "var(--white)", padding: "0.5rem", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-sm)" }}>
          <button 
            onClick={() => setActiveTab("booking")}
            style={{ 
              flex: 1, 
              padding: "0.75rem", 
              borderRadius: "var(--radius-lg)",
              background: activeTab === "booking" ? "var(--teal-50)" : "transparent",
              color: activeTab === "booking" ? "var(--teal-700)" : "var(--gray-700)",
              fontWeight: activeTab === "booking" ? "600" : "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}
          >
            <MessageCircle size={18} />
            <span style={{ display: "none" }} className="sm-block">Booking</span>
          </button>
          <button 
            onClick={() => setActiveTab("faq")}
            style={{ 
              flex: 1, 
              padding: "0.75rem", 
              borderRadius: "var(--radius-lg)",
              background: activeTab === "faq" ? "var(--teal-50)" : "transparent",
              color: activeTab === "faq" ? "var(--teal-700)" : "var(--gray-700)",
              fontWeight: activeTab === "faq" ? "600" : "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}
          >
            <Stethoscope size={18} />
            <span style={{ display: "none" }} className="sm-block">FAQ</span>
          </button>
          <button 
            onClick={() => setActiveTab("summary")}
            style={{ 
              flex: 1, 
              padding: "0.75rem", 
              borderRadius: "var(--radius-lg)",
              background: activeTab === "summary" ? "var(--teal-50)" : "transparent",
              color: activeTab === "summary" ? "var(--teal-700)" : "var(--gray-700)",
              fontWeight: activeTab === "summary" ? "600" : "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}
          >
            <FileText size={18} />
            <span style={{ display: "none" }} className="sm-block">Summary</span>
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {activeTab === "booking" && <BookingBot />}
          {activeTab === "faq" && <FAQBot />}
          {activeTab === "summary" && <VisitSummary />}
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 640px) {
          .sm-block {
            display: inline !important;
          }
        }
      `}</style>
    </main>
  );
}
