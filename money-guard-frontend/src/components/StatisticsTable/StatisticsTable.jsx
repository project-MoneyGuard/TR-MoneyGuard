import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteTransactionAPI,
  fetchTransactions,
  fetchCategories
} from '../../redux/finance/operations'
import { FaPen } from "react-icons/fa"
import ModalEditTransaction from '../ModalEditTransaction/ModalEditTransaction'
import ModalDeleteConfirm from '../ModalDeleteConfirm/ModalDeleteConfirm'
import ButtonAddTransactions from '../ButtonAddTransactions/ButtonAddTransactions'
import ModalAddTransaction from "../ModalAddTransaction/ModalAddTransaction";
import styles from './StatisticsTable.module.css'
import { ScaleLoader } from "react-spinners";

const TransactonsTable = () => {
  const dispatch = useDispatch()
  const { transactions, categories, isLoading } = useSelector((state) => state.finance)
  const [showModal, setShowModal] = useState(false)
  const [selectedTrans, setSelectedTrans] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchTransactions())
  }, [dispatch])

  const getCategName = (catId) => {
    const cat = categories.find((c) => c.id === catId)
    return cat ? cat.name : '-'
  }

  const formatDat = (d) => {
    const date = new Date(d)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}.${month}.${year}`
  }

  const delTransaction = (id) => {
    setTransactionToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (transactionToDelete) {
      dispatch(deleteTransactionAPI(transactionToDelete))
    }
    setShowDeleteModal(false)
    setTransactionToDelete(null)
  }

  const openEdit = (transaction) => {
    setSelectedTrans(transaction)
    setShowModal(true)
  }

  const closeEdit = () => {
    setShowModal(false)
    setSelectedTrans(null)
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  if (isLoading || !categories.length) {
    return(
      <div className={styles.loaderContainer}>
      <div className={styles.loading} style={{margin: '0 auto' }}>
        <ScaleLoader color="var( --color-yellow)" size={50} className={styles.loaderBox}/>
      </div>
    </div>
    ) 
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Comment</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr className={`styles.EmpyError ${styles.EmpyErrorBox}`}>
              <td colSpan="6" className={styles.emptyContainer}>
                <div className={styles.emptyMessage} style={{marginBottom : "10px"}}>Currently no transactions available</div>
                <div className={styles.emptySubMessage}>
                  <div style={{marginBottom : "10px"}}>Click the button to add your first transaction</div>
                  <button onClick={openAddModal} className={"gradientBtn"} style={{padding : "13px 20px"}}>Add Transaction</button>
                </div>
              </td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t.id}>
                <td data-label="Date">{formatDat(t.transactionDate)}</td>
                <td data-label="Type">
                  {t.type === 'INCOME' ? (
                    <span className={styles.incomeType}>+</span>
                  ) : (
                    <span className={styles.expenseType}>-</span>
                  )}
                </td>
                <td data-label="Category">{getCategName(t.categoryId)}</td>
                <td data-label="Comment">{t.comment || 'No comment'}</td>
                <td data-label="Sum" style={{ color: t.type === 'INCOME' ? '#FFB627' : '#FF868D', fontWeight: '600' }}>
                  {t.amount.toFixed(2)}
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.deleteButton} onClick={() => openEdit(t)}>
                      <FaPen />
                    </button>
                    <button className={`gradientBtn ${styles.btnPadding}`} onClick={() => delTransaction(t.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ModalEditTransaction
        isOpen={showModal}
        onClose={closeEdit}
        transaction={selectedTrans}
      />

      <ModalDeleteConfirm
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      <ButtonAddTransactions
        className={`gradientBtn ${styles.addBtn}`}
        onClick={openAddModal}
      />

      <ModalAddTransaction
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
      />
    </div>
  )
}

export default TransactonsTable
