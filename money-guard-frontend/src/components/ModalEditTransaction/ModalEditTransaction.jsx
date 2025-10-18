import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTransaction } from "../../redux/slices/financeslice";

const ModalEditTransaction = ({ transaction, onClose }) => {
  const [formData, setFormData] = useState({
    date: transaction.date || "",
    type: transaction.type || "",
    category: transaction.category || "",
    comment: transaction.comment || "",
    amount: transaction.amount || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    dispatch(
      updateTransaction({
        id: transaction.id,
        updatedTransaction: formData,
      })
    );
    onClose();
  };

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2>İşlemi Düzenle</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Tarih:</label>
            <input
              type='date'
              name='date'
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Tip:</label>
            <select
              name='type'
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value=''>Seçiniz</option>
              <option value='income'>Gelir</option>
              <option value='expense'>Gider</option>
            </select>
          </div>

          <div>
            <label>Kategori:</label>
            <input
              type='text'
              name='category'
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Yorum:</label>
            <textarea
              name='comment'
              value={formData.comment}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Tutar:</label>
            <input
              type='number'
              name='amount'
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className='modal-actions'>
            <button type='button' onClick={onClose}>
              İptal
            </button>
            <button type='submit' disabled={isSubmitting}>
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditTransaction;
