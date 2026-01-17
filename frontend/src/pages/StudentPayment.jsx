import { useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "../styles/payment.css";
import { 
    CreditCard, 
    User, 
    Calendar, 
    CheckCircle, 
    AlertCircle, 
    Loader2,
    Clock,
    Check,
    X,
    Download,
    Filter,
    IndianRupee
} from "lucide-react";

export default function StudentPayment() {
    const { user } = useAuth();
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [payments, setPayments] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    const fetchPaymentHistory = async () => {
        try {
            const res = await API.get(`/payments/student/${user._id}`);
            setPayments(res.data);
        } catch (error) {
            console.error(error);
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
        }
        setHistoryLoading(false);
    };

    const filteredPayments = filterStatus === "all" 
        ? payments 
        : payments.filter(payment => payment.status === filterStatus);

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return { color: "#f59e0b", icon: <Clock size={14} />, text: "Pending" };
            case "completed":
                return { color: "#10b981", icon: <Check size={14} />, text: "Completed" };
            case "failed":
                return { color: "#ef4444", icon: <X size={14} />, text: "Failed" };
            default:
                return { color: "#64748b", icon: <Clock size={14} />, text: status };
        }
    };

    const isFormValid = amount && parseFloat(amount) > 0;

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);
        setShowError(false);
        
        try {
            await API.post("/payments", {
                studentId: user._id,
                studentName: user.name,
                amount,
                status: "pending",
                date: new Date(),
            });
            setShowSuccess(true);
            setAmount("");
            fetchPaymentHistory(); // refresh history after new payment
            
            // Hide success message after 3 seconds
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error(error);
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="payment-container">
            {/* Payment Form Section */}
            <div className="payment-section">
                <div className="payment-card">
                    <div className="card-header">
                        <div className="header-icon">
                            <CreditCard size={32} />
                        </div>
                        <div className="header-text">
                            <h2>Hostel Fee Payment</h2>
                            <p className="header-subtitle">
                                Secure and convenient fee payment
                            </p>
                        </div>
                    </div>

                    {/* Feedback Messages */}
                    {showSuccess && (
                        <div className="feedback-message success">
                            <CheckCircle size={20} />
                            <span>Payment submitted successfully!</span>
                        </div>
                    )}
                    
                    {showError && (
                        <div className="feedback-message error">
                            <AlertCircle size={20} />
                            <span>Payment failed. Please try again.</span>
                        </div>
                    )}

                    {/* Student Info Card */}
                    <div className="student-info">
                        <div className="info-icon">
                            <User size={20} />
                        </div>
                        <div className="info-details">
                            <h3>Student Information</h3>
                            <p className="student-name">{user.name}</p>
                            <p className="student-id">ID: {user._id}</p>
                        </div>
                    </div>

                    <form onSubmit={handlePayment}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="amount">
                                <IndianRupee size={16} />
                                Payment Amount
                            </label>
                            <div className="amount-input-wrapper">
                                <input
                                    id="amount"
                                    type="number"
                                    placeholder="Enter hostel fee amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="form-input"
                                    min="1"
                                    step="0.01"
                                    required
                                />
                                {amount && (
                                    <div className="amount-preview">
                                        {formatCurrency(amount)}
                                    </div>
                                )}
                            </div>
                            <p className="input-hint">
                                Enter the amount you wish to pay for hostel fees
                            </p>
                        </div>

                        <button 
                            type="submit" 
                            className={`submit-btn ${!isFormValid ? 'disabled' : ''}`}
                            disabled={!isFormValid || loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="spinner" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CreditCard size={20} />
                                    Pay Hostel Fees
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Payment History Section */}
            <div className="history-section">
                <div className="history-header">
                    <div className="history-title">
                        <Calendar size={24} />
                        <h3>Payment History</h3>
                    </div>
                    
                    {/* Filter Buttons */}
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filterStatus === "all" ? 'active' : ''}`}
                            onClick={() => setFilterStatus("all")}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${filterStatus === "pending" ? 'active' : ''}`}
                            onClick={() => setFilterStatus("pending")}
                        >
                            Pending
                        </button>
                        <button
                            className={`filter-btn ${filterStatus === "completed" ? 'active' : ''}`}
                            onClick={() => setFilterStatus("completed")}
                        >
                            Completed
                        </button>
                        <button
                            className={`filter-btn ${filterStatus === "failed" ? 'active' : ''}`}
                            onClick={() => setFilterStatus("failed")}
                        >
                            Failed
                        </button>
                    </div>
                </div>

                <div className="history-content">
                    {historyLoading ? (
                        <div className="loading-state">
                            <Loader2 size={24} className="spinner" />
                            <p>Loading payment history...</p>
                        </div>
                    ) : filteredPayments.length === 0 ? (
                        <div className="empty-state">
                            <CreditCard size={48} />
                            <h4>No payments found</h4>
                            <p>You haven't made any hostel fee payments yet.</p>
                        </div>
                    ) : (
                        <div className="payments-table">
                            <div className="table-header">
                                <div className="header-cell">Amount</div>
                                <div className="header-cell">Status</div>
                                <div className="header-cell">Date</div>
                                <div className="header-cell">Actions</div>
                            </div>
                            <div className="table-body">
                                {filteredPayments.map((payment, index) => (
                                    <div key={payment._id} className={`payment-row ${index === 0 ? 'latest' : ''}`}>
                                        <div className="cell amount-cell">
                                            <IndianRupee size={16} />
                                            {formatCurrency(payment.amount)}
                                        </div>
                                        <div className="cell">
                                            <div 
                                                className="status-badge"
                                                style={{ 
                                                    backgroundColor: getStatusBadge(payment.status).color + '20',
                                                    color: getStatusBadge(payment.status).color 
                                                }}
                                            >
                                                {getStatusBadge(payment.status).icon}
                                                <span>{getStatusBadge(payment.status).text}</span>
                                            </div>
                                        </div>
                                        <div className="cell date-cell">
                                            {formatDate(payment.date)}
                                        </div>
                                        <div className="cell actions-cell">
                                            {payment.status === "completed" && (
                                                <button className="receipt-btn" title="Download Receipt">
                                                    <Download size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
