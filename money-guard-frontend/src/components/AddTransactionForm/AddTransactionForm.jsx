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
    let transactionData = {
      type: data.type,
      amount:
        data.type === "EXPENSE"
          ? -Math.abs(Number(data.amount))
          : Number(data.amount),
      transactionDate: data.date.toISOString(),
      comment: data.comment.trim(),
    };

    if (data.type === "EXPENSE") {
      transactionData.categoryId = data.categoryId;
    } else {
      const incomeCategory =
        categories.find(
          (cat) =>
            cat.type?.toUpperCase() === "INCOME" ||
            cat.name?.toLowerCase() === "income"
        ) || categories[0];
      if (incomeCategory) {
        transactionData.categoryId = incomeCategory.id;
      }
    }

    try {
      await dispatch(addTransactionAPI(transactionData)).unwrap();
      toast.success("Transaction added successfully!");
      onClose();
    } catch (error) {
      toast.error(error || "Failed to add transaction. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.addForm}>
      <Controller
        name="isExpense"
        control={control}
        render={({ field }) => (
          <div className={styles.switcher}>
            <span
              className={!field.value ? styles.activeIncome : ""}
              onClick={() => field.onChange(false)}
            >
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

            <span
              className={field.value ? styles.activeExpense : ""}
              onClick={() => field.onChange(true)}
            >
              Expense
            </span>
          </div>
        )}
      />

      {isExpense && (
        <div className={styles.inputContainer}>
          <select
            id="categoryId"
            {...register("categoryId")}
            className={errors.categoryId ? "error" : ""}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <span className={"errorMessage"}>{errors.categoryId.message}</span>
          )}
        </div>
      )}

      <div className={"sumDateWrapper"}>
        <div className={styles.inputContainer}>
          <input
            id="amount"
            type="number"
            placeholder="0.00"
            {...register("amount")}
            className={errors.amount ? "error" : ""}
          />
          {errors.amount && (
            <span className={"errorMessage"}>{errors.amount.message}</span>
          )}
        </div>
        <div className={styles.inputContainer}>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="date"
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat="dd.MM.yyyy"
                className={errors.date ? "error" : ""}
                wrapperClassName={styles.datePickerWrapper}
              />
            )}
          />
          {errors.date && (
            <span className={"errorMessage"}>{errors.date.message}</span>
          )}
        </div>
      </div>

      <div className={styles.inputContainer}>
        <textarea
          id="comment"
          placeholder="Your comment"
          {...register("comment")}
          className={errors.comment ? "error" : ""}
        />
        {errors.comment && (
          <span className={"errorMessage"}>{errors.comment.message}</span>
        )}
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={"gradientBtn"}>
          ADD
        </button>
        <button type="button" onClick={onClose} className={"whiteBtn"}>
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
