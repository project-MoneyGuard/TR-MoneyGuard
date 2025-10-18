import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTransaction } from "../../redux/slices/financeslice";
import ModalEditTransaction from "../ModalEditTransaction/ModalEditTransaction";

const TransactionsItem = ({ transaction, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
    dispatch(deleteTransaction(transaction.id));
    if (onDelete) {
      onDelete(transaction.id);
    }
    setIsDeleting(false);
  };

  return (
    <div>
      <div>Tarih: {transaction.date}</div>
      <div>Tip: {transaction.type}</div>
      <div>Kategori: {transaction.category}</div>
      <div>Yorum: {transaction.comment}</div>
      <div>Tutar: {transaction.amount}</div>
      <button onClick={handleEditClick}>Düzenle</button>
      <button onClick={handleDeleteClick} disabled={isDeleting}>
        {isDeleting ? "Siliniyor..." : "Sil"}
      </button>

      {isModalOpen && (
        <ModalEditTransaction
          transaction={transaction}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default TransactionsItem;
