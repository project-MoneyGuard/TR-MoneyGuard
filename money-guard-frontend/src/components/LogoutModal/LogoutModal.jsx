import Modal from "react-modal";
import css from './LogoutModal.module.css';

function LogoutModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      isOpen={isOpen}
      className={`modal ${css.logoutModal}`}
      overlayClassName={"modal_Wrap"}
      onRequestClose={onClose}
    >
      <div className={"modal_close"} onClick={onClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path d="M1 1L17 17" stroke="#FBFBFB" />
          <path d="M1 17L17 0.999999" stroke="#FBFBFB" />
        </svg>
      </div>
      <img alt="Money Guard Logo" src="/headerlogo.svg"></img>
      <p>Are you sure you want to log out?</p>

      <div className={css.confirmGroup}>
        <button onClick={onConfirm} className="gradientBtn">
          Log Out
        </button>
        <button onClick={onClose} className="whiteBtn">
          Cancel
        </button>
      </div>
    </Modal>
  );
}

export default LogoutModal;