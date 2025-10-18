const ModalAddTransaction = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div>
      <div>
        <h3>Add Transaction</h3>
        <p>Modal Component</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ModalAddTransaction;
