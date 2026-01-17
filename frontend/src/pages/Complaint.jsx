import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/complaint.css";
import { 
    AlertTriangle, 
    FileText, 
    Send, 
    CheckCircle, 
    AlertCircle, 
    Loader2,
    Home,
    Utensils,
    Zap,
    Droplets,
    Sparkles
} from "lucide-react";

export default function Complaint() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("room");
    const [priority, setPriority] = useState("medium");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const categories = [
        { value: "room", label: "Room Issue", icon: <Home size={20} /> },
        { value: "food", label: "Food Quality", icon: <Utensils size={20} /> },
        { value: "electricity", label: "Electricity", icon: <Zap size={20} /> },
        { value: "water", label: "Water Supply", icon: <Droplets size={20} /> },
        { value: "cleanliness", label: "Cleanliness", icon: <Sparkles size={20} /> }
    ];

    const priorities = [
        { value: "low", label: "Low", color: "#10b981" },
        { value: "medium", label: "Medium", color: "#f59e0b" },
        { value: "high", label: "High", color: "#ef4444" }
    ];

    const isFormValid = title.trim().length >= 3 && description.trim().length >= 10;

    const submitComplaint = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        
        setIsSubmitting(true);
        setShowError(false);
        
        try {
            await API.post("/complaints", { 
                title, 
                description, 
                category,
                priority
            });
            setShowSuccess(true);
            
            // Reset form
            setTitle("");
            setDescription("");
            setCategory("room");
            setPriority("medium");
            
            // Redirect to dashboard after success
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (error) {
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="complaint-container">
            <div className="complaint-card">
                {/* Header */}
                <div className="complaint-header">
                    <div className="header-icon">
                        <AlertTriangle size={32} />
                    </div>
                    <div className="header-text">
                        <h2>Submit Complaint</h2>
                        <p className="header-subtitle">
                            Help us improve your hostel experience by reporting issues
                        </p>
                    </div>
                </div>

                {/* Feedback Messages */}
                {showSuccess && (
                    <div className="feedback-message success">
                        <CheckCircle size={20} />
                        <span>Complaint submitted successfully! Redirecting...</span>
                    </div>
                )}
                
                {showError && (
                    <div className="feedback-message error">
                        <AlertCircle size={20} />
                        <span>Failed to submit complaint. Please try again.</span>
                    </div>
                )}

                <form onSubmit={submitComplaint}>
                    {/* Category Selection */}
                    <div className="form-group">
                        <label className="form-label">
                            <FileText size={16} />
                            Issue Category
                        </label>
                        <div className="category-grid">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    className={`category-btn ${category === cat.value ? 'active' : ''}`}
                                    onClick={() => setCategory(cat.value)}
                                >
                                    <span className="category-icon">{cat.icon}</span>
                                    <span className="category-label">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Priority Selection */}
                    <div className="form-group">
                        <label className="form-label">
                            <AlertTriangle size={16} />
                            Priority Level
                        </label>
                        <div className="priority-grid">
                            {priorities.map((pri) => (
                                <button
                                    key={pri.value}
                                    type="button"
                                    className={`priority-btn ${priority === pri.value ? 'active' : ''}`}
                                    style={{ 
                                        '--priority-color': pri.color,
                                        '--priority-color-light': pri.color + '33'
                                    }}
                                    onClick={() => setPriority(pri.value)}
                                >
                                    {pri.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Complaint Title */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="title">
                            <FileText size={16} />
                            Complaint Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Brief summary of the issue (min. 3 characters)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-input"
                            maxLength={100}
                            required
                        />
                        <div className="input-hint">
                            {title.length}/100 characters
                        </div>
                    </div>

                    {/* Complaint Description */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">
                            <FileText size={16} />
                            Detailed Description
                        </label>
                        <textarea
                            id="description"
                            placeholder="Please explain the issue in detail (min. 10 characters)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-textarea"
                            rows={6}
                            maxLength={500}
                            required
                        />
                        <div className="input-hint">
                            {description.length}/500 characters
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="submit-section">
                        <button 
                            type="submit" 
                            className={`submit-btn ${!isFormValid ? 'disabled' : ''}`}
                            disabled={!isFormValid || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={20} className="spinner" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Submit Complaint
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Additional Help */}
                <div className="help-section">
                    <p className="help-text">
                        <strong>Need help?</strong> Contact the hostel office at 
                        <a href="mailto:hostel@college.edu" className="help-link">
                            hostel@college.edu
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}