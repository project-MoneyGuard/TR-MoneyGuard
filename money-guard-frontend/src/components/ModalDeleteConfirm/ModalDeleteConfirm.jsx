
import Modal from "react-modal";
import css from './ModalDeleteConfirm.module.css'
function ModalDeleteConfirm({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      isOpen={isOpen}
      className={`modal ${css.deleteModal}` }
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

      <h2>Warning!</h2>
      <p>Are you sure you want to delete this transaction?</p>

      <div className={css.confirmGroup}>
        <button onClick={onConfirm} className="gradientBtn">
          Yes
        </button>
        <button onClick={onClose} className="whiteBtn" >
          No
        </button>
      </div>
    </Modal>
  );
}

export default ModalDeleteConfirm;
