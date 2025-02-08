import { ReactNode, useEffect, useState } from "react";
import "./Modal.css";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal = ({ onClose, children }: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className={`modal-overlay ${isVisible ? "visible" : ""}`} onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={handleClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
