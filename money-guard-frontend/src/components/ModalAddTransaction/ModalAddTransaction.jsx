import React from "react";
import Modal from "react-modal";
import s from "./ModalAddTransaction.module.css";
import AddTransactionForm from "../AddTransactionForm/AddTransactionForm";

Modal.setAppElement("#root");

function ModalAddTransaction({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      className={s.modal}
      overlayClassName={s.modal_Wrap}
      onRequestClose={onClose}
    >
      <div className={s.modal_close} onClick={onClose}>
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

      <h2>Add transaction</h2>
      <AddTransactionForm onClose={onClose} />
    </Modal>
  );
}

export default ModalAddTransaction;
