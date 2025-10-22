import React, { useEffect, useState } from "react";
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
  categoryId: yup.string().required("Category is required"),
});

const AddTransactionForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.finance.categories);
  const [incomeCategory, setIncomeCategory] = useState(null);

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
    if (categories.length > 0) {
      const foundIncomeCategory = categories.find(cat => 
        cat.name?.toLowerCase().includes('income') || 
        cat.type === 'INCOME' ||
        cat.name === 'Income'
      );
      
      if (foundIncomeCategory) {
        setIncomeCategory(foundIncomeCategory);
        console.log('Found income category:', foundIncomeCategory);
      } else {
        console.log('No income category found, available categories:', categories);
        setIncomeCategory(categories[0]);
      }
    }
  }, [categories]);

  useEffect(() => {
    setValue("type", isExpense ? "EXPENSE" : "INCOME");
    
   
    if (!isExpense && incomeCategory) {
      setValue("categoryId", incomeCategory.id);
    }
    
   
    if (isExpense) {
      setValue("categoryId", "");
    }
  }, [isExpense, setValue, incomeCategory]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    
    
    let finalCategoryId = data.categoryId;
    
    if (!isExpense && incomeCategory) {
      finalCategoryId = incomeCategory.id;
    }

    const transactionData = {
      type: data.type,
      amount: data.type === "EXPENSE" 
        ? -Math.abs(Number(data.amount))
        : Math.abs(Number(data.amount)),
      transactionDate: data.date.toISOString(),
      comment: data.comment.trim(),
      categoryId: finalCategoryId
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
      
      let errorMessage = "Failed to add transaction. Please try again.";
      
      if (error && Array.isArray(error)) {
        errorMessage = error.join(", ");
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

 
  const expenseCategories = categories.filter(cat => 
    !cat.name?.toLowerCase().includes('income') && 
    cat.type !== 'INCOME'
  );

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
            {expenseCategories.map((category) => (
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

      
      {!isExpense && (
        <input
          type="hidden"
          {...register("categoryId")}
          value={incomeCategory?.id || ""}
        />
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