import "../styles/Modal.css";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box enhanced-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn enhanced-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}