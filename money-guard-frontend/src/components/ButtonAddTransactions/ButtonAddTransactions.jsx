import { useState } from "react";
import ModalAddTransaction from "../ModalAddTransaction/ModalAddTransaction";

const ButtonAddTransactions = ({ name, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={handleOpenModal} className={className}>
        {name}
      </button>

      <ModalAddTransaction isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default ButtonAddTransactions;
