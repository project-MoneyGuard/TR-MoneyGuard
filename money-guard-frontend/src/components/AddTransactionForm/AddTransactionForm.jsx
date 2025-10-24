import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addTransactionAPI, fetchCategories } from "../../redux/finance/operations";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import styles from "./AddTransactionForm.module.css";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";  

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
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                classNamePrefix="custom"
                className={styles.wrapper}
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
                value={
                  field.value
                    ? {
                        value: field.value,
                        label:
                          categories.find((c) => c.id === field.value)?.name || "",
                      }
                    : null
                }
                onChange={(selected) => field.onChange(selected ? selected.value : "")}
                placeholder="Select a category"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    background: "transparent",
                    color: "var(--color-white)",
                    border: "none",
                    borderBottom: state.isFocused ? "1px solid var(--color-yellow)" : "1px solid var(--color-white)",
                    outline : 'none',
                    padding: "2px 4px",
                    minHeight: "46px",
                    transition: "all 0.2s ease",
                    widt: "100%",
                    "&:hover": {
                    },"&:focus": {
                      outline : 'none',
                      border : 'none'
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    background: "linear-gradient(0deg, rgba(83, 61, 186, 0.8) 0%, rgba(80, 48, 154, 0.8) 36%, rgba(106, 70, 165, 0.8) 61%, rgba(133, 93, 175, 0.8) 100%)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    padding: "4px 0",
                  }),
                  option: (base, state) => ({
                    ...base,
                    color: state.isSelected ? "var(--color-pink)" : "var(--color-white)",
                    backgroundColor: state.isFocused
                      ? "rgba(255,255,255,0.1)"
                      : "",
                    cursor: "pointer",
                    padding: "10px 16px",
                    transition: "background 0.15s ease",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "var(---color-muted)",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "var(--color-white)",
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    color: "var(--color-white)",
                    "&:hover": {
                      color: "var(--color-linear-purple)",
                    },
                  }),
                  indicatorSeparator: () => ({ display: "none" }),
                  input: (base) => ({
                    ...base,
                    color: "var(--color-white)",
                  }),
                }}
              />
            )}
          />
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
