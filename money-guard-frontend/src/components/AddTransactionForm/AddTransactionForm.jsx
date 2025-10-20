import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  addTransactionAPI,
  fetchCategories,
} from "../../redux/finance/operations";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import styles from "./AddTransactionForm.module.css";
import "react-datepicker/dist/react-datepicker.css";

const schema = yup.object().shape({
  isExpense: yup.boolean().required(),
  type: yup.string().required(),
  amount: yup
    .number()
    .typeError("Sum must be a number")
    .positive("Sum must be positive")
    .required("Sum is required"),
  date: yup.date().required("Date is required"),
  comment: yup.string().required("Comment is required"),
  categoryId: yup.string().when("type", {
    is: "EXPENSE",
    then: (schema) => schema.required("Category is required for expenses"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const AddTransactionForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.finance.categories);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      isExpense: true,
      type: "EXPENSE",
      date: new Date(),
      amount: "",
      comment: "",
      categoryId: "",
    },
  });

  const isExpense = watch("isExpense");

  useEffect(() => {
    setValue("type", isExpense ? "EXPENSE" : "INCOME");
    if (!isExpense) {
      setValue("categoryId", "");
    }
  }, [isExpense, setValue]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const onSubmit = async (data) => {
    const transactionData = {
      type: data.type,
      amount:
        data.type === "EXPENSE"
          ? -Math.abs(Number(data.amount))
          : Number(data.amount),
      transactionDate: data.date.toISOString(),
      comment: data.comment.trim(),
      categoryId: data.type === "EXPENSE" ? data.categoryId : null,
    };

    console.log("Sending transaction:", transactionData);

    try {
      const result = await dispatch(
        addTransactionAPI(transactionData)
      ).unwrap();
      console.log("Transaction added:", result);

      toast.success("Transaction added successfully!");
      onClose();
    } catch (error) {
      console.error("Add transaction failed:", error);
      toast.error(error || "Failed to add transaction. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Controller
        name="isExpense"
        control={control}
        render={({ field }) => (
          <div className={styles.switcher}>
            <span className={!field.value ? styles.activeIncome : ""}>
              Income
            </span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
            <span className={field.value ? styles.activeExpense : ""}>
              Expense
            </span>
          </div>
        )}
      />

      {isExpense && (
        <div className={styles.formGroup}>
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            {...register("categoryId")}
            className={errors.categoryId ? styles.inputError : ""}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className={styles.errorMsg}>{errors.categoryId.message}</p>
          )}
        </div>
      )}

      <div className={styles.sumDateWrapper}>
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
                className={errors.date ? styles.inputError : ""}
                wrapperClassName={styles.datePickerWrapper}
              />
            )}
          />
          {errors.date && (
            <p className={styles.errorMsg}>{errors.date.message}</p>
          )}
        </div>
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
        <button type="submit" className={styles.btnAdd}>
          ADD
        </button>
        <button type="button" onClick={onClose} className={styles.btnCancel}>
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
