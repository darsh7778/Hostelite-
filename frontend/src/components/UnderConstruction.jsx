import React from "react";
import { Wrench, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/UnderConstruction.css"; 

export default function UnderConstruction() {
  const navigate = useNavigate();

  return (
    <div className="underconstruction-container">
      <div className="underconstruction-card">
        <Wrench size={64} className="uc-icon" />
        <h1 className="uc-title">Coming Soon!</h1>
        <p className="uc-text">
          This section is currently under development. Our team is working hard
          to bring this feature live soon.
        </p>
        <p className="uc-note">
          Thank you for your patience and understanding.
        </p>

        <button
          className="uc-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
