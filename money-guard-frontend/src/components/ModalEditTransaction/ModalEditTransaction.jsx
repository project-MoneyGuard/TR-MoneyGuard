import React from "react";
import Modal from "react-modal";
import EditTransactionForm from "../EditTransactionForm/EditTransactionForm";
import css from "./ModalEditTransaction.module.css";

Modal.setAppElement("#root");

function ModalEditTransaction({ isOpen, onClose, transaction }) {
  return (
    <Modal
      isOpen={isOpen}
      className={`modal ${css.editModal}`}
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

      <h2>Edit transaction</h2>
      <EditTransactionForm onClose={onClose} initialData={transaction} />
    </Modal>
  );
}

export default ModalEditTransaction;
