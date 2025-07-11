// src/components/modal/Modal.jsx
import './ModalStyle.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="modal">
        <div className="headerModal">
          <h2>{title}</h2>
          <button onClick={onClose} className="closeBtn">×</button>
        </div>
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
