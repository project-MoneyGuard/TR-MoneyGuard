import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { updateTransactionAPI } from "../../redux/finance/operations";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import styles from "./EditTransactionForm.module.css";
import "react-datepicker/dist/react-datepicker.css";

const schema = yup.object().shape({
  amount: yup
    .number()
    .typeError("Sum must be a number")
    .positive("Sum must be positive")
    .required("Sum is required"),
  date: yup.date().required("Date is required"),
  comment: yup.string().required("Comment is required"),
});

const EditTransactionForm = ({ transaction, onClose }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: transaction?.amount || "",
      date: transaction?.date ? new Date(transaction.date) : new Date(),
      comment: transaction?.comment || "",
    },
  });

  useEffect(() => {
    if (transaction) {
      reset({
        amount: transaction.amount,
        date: new Date(transaction.date),
        comment: transaction.comment,
      });
    }
  }, [transaction, reset]);

  const onSubmit = async (data) => {
    const updates = {
      amount: data.amount,
      date: data.date.toISOString(),
      comment: data.comment,
    };

    try {
      await dispatch(
        updateTransactionAPI({ transactionId: transaction.id, updates })
      ).unwrap();
      toast.success("Transaction updated successfully!");
      onClose();
    } catch (error) {
      const errorMessage = error || "Failed to update. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <div className={styles.formGroup}>
        <label htmlFor="amount">Sum</label>
        <input
          id="amount"
          type="number"
          placeholder="0.00"
          {...register("amount")}
          className={errors.amount ? styles.inputError : ""}
        />
        {errors.amount && (
          <p className={styles.errorMsg}>{errors.amount.message}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="date">Date</label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              id="date"
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat="dd.MM.yyyy"
              className={`${styles.dateInput} ${
                errors.date ? styles.inputError : ""
              }`}
              wrapperClassName={styles.datePickerWrapper}
            />
          )}
        />
        {errors.date && (
          <p className={styles.errorMsg}>{errors.date.message}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="comment">Comment</label>
        <textarea
          id="comment"
          placeholder="Your comment"
          {...register("comment")}
          className={errors.comment ? styles.inputError : ""}
        />
        {errors.comment && (
          <p className={styles.errorMsg}>{errors.comment.message}</p>
        )}
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.btnSave}>
          SAVE
        </button>
        <button type="button" onClick={onClose} className={styles.btnCancel}>
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default EditTransactionForm;
