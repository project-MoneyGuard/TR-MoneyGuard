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

  const wrapperStyle = {
    position: "fixed",
    bottom: "80px",
    right: "24px",
    zIndex: 1050,
  };

  return (
    <div style={wrapperStyle}>
      <button onClick={handleOpenModal} className={className}>
        {name}
      </button>

      <ModalAddTransaction isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default ButtonAddTransactions;
