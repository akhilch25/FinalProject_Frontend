import React from 'react';
import '../../App.css'; 
import { RxCross2 } from "react-icons/rx";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    // Close modal when clicking outside the content area
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button className="close-button" onClick={onClose}><RxCross2 /></button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
