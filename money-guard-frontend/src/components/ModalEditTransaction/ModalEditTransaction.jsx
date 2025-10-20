import React from "react";
import Modal from "react-modal";
import styles from "./ModalEditTransaction.module.css";
import EditTransactionForm from "../EditTransactionForm/EditTransactionForm";

Modal.setAppElement("#root");

const ModalEditTransaction = ({ isOpen, onClose, transaction }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
      contentLabel="Edit Transaction Modal"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
    >
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2>Edit transaction</h2>

        {transaction && (
          <EditTransactionForm transaction={transaction} onClose={onClose} />
        )}
      </div>
    </Modal>
  );
};

export default ModalEditTransaction;
