"use client";

import { useState } from "react";
import { Stethoscope, User, AlertCircle, FileText, Pill, Loader2, Send } from "lucide-react";

export default function VisitSummary() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    complaint: "",
    diagnosis: "",
    medicines: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.name || !formData.complaint || !formData.diagnosis) {
      setError("Please fill out Name, Complaint, and Diagnosis.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "1rem" }}>
      
      {/* Form Area */}
      <div className="glass-card" style={{ flex: "0 0 auto", padding: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem", color: "var(--teal-700)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileText size={20} /> Doctor Input Form
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--gray-700)", marginBottom: "0.4rem" }}>
              <User size={14} /> Patient Name
            </label>
            <input type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} placeholder="e.g. Rahul Kumar" />
          </div>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--gray-700)", marginBottom: "0.4rem" }}>
              <User size={14} /> Age
            </label>
            <input type="number" name="age" className="input-field" value={formData.age} onChange={handleChange} placeholder="e.g. 34" />
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--gray-700)", marginBottom: "0.4rem" }}>
            <AlertCircle size={14} /> Chief Complaint
          </label>
          <input type="text" name="complaint" className="input-field" value={formData.complaint} onChange={handleChange} placeholder="e.g. Fever and cough for 3 days" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--gray-700)", marginBottom: "0.4rem" }}>
              <Stethoscope size={14} /> Diagnosis
            </label>
            <input type="text" name="diagnosis" className="input-field" value={formData.diagnosis} onChange={handleChange} placeholder="e.g. Viral Pharyngitis" />
          </div>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--gray-700)", marginBottom: "0.4rem" }}>
              <Pill size={14} /> Medicines Prescribed
            </label>
            <input type="text" name="medicines" className="input-field" value={formData.medicines} onChange={handleChange} placeholder="e.g. Paracetamol 500mg" />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {error && <span style={{ color: "red", fontSize: "0.85rem" }}>{error}</span>}
          {!error && <span></span>}
          <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-pulse" /> : "Generate Summaries"}
          </button>
        </div>
      </div>

      {/* Results Area */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", overflow: "hidden" }}>
        
        {/* Clinical Summary */}
        <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", border: "1px solid var(--gray-200)", padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <h4 style={{ color: "var(--teal-700)", marginBottom: "1rem", borderBottom: "2px solid var(--teal-100)", paddingBottom: "0.5rem" }}>Clinical Summary</h4>
          <div style={{ flex: 1, whiteSpace: "pre-wrap", fontSize: "0.95rem", color: "var(--gray-800)", lineHeight: 1.6 }}>
            {loading ? <div className="animate-pulse" style={{ height: "100px", background: "var(--gray-100)", borderRadius: "var(--radius-md)" }}></div> : 
             result ? result.clinicalSummary : 
             <span style={{ color: "var(--gray-300)" }}>Fill the form and click generate...</span>}
          </div>
        </div>

        {/* WhatsApp Message */}
        <div style={{ background: "#e5ddd5", borderRadius: "var(--radius-lg)", border: "1px solid var(--gray-200)", padding: "1rem", overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#075e54", color: "white", padding: "0.75rem", borderRadius: "var(--radius-md) var(--radius-md) 0 0", margin: "-1rem -1rem 1rem -1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Send size={16} /> Patient WhatsApp
          </div>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {loading ? (
              <div className="chat-bubble bot animate-pulse" style={{ background: "#dcf8c6", alignSelf: "flex-end" }}>
                Generating...
              </div>
            ) : result ? (
              <div className="chat-bubble bot animate-fade-in" style={{ background: "#dcf8c6", color: "#303030", alignSelf: "flex-end", whiteSpace: "pre-wrap" }}>
                {result.whatsappMessage}
              </div>
            ) : (
              <div className="chat-bubble bot" style={{ background: "#dcf8c6", color: "#303030", alignSelf: "flex-end", opacity: 0.5 }}>
                Message preview will appear here...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
