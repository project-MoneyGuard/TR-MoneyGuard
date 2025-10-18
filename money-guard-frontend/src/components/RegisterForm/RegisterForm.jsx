import styles from "./RegisterForm.module.css";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "../../redux/auth/operations";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(12, "Password must be at most 12 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords do not match")
      .required("Confirm password is required"),
  })
  .required();

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error: reduxError } = useSelector(
    (state) => state.auth || {}
  );

  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordStrength(password === confirmPassword ? 100 : 0);
    } else if (password && !confirmPassword) {
      setPasswordStrength(password.length > 5 ? 30 : 10);
    } else {
      setPasswordStrength(0);
    }
  }, [password, confirmPassword]);

  const onSubmit = async (data) => {
    try {
      await dispatch(
        registerUser({
          username: data.name,
          email: data.email,
          password: data.password,
        })
      ).unwrap();

      toast.success("Registration successful! Welcome!");

      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.message || "Registration failed. Please try again.";

      toast.error(errorMessage); // <-- EKLENDİ

      console.error("Registration failed:", error);
    }
  };

  return (
    <div className={styles.authCard}>
      <div className={styles.logoContainer}>
        <div className={styles.logoPlaceholder}>
          <span className={styles.brandLetter}>MG</span>
        </div>
        <h1 className={styles.brandName}>Money Guard</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
        noValidate
      >
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className={`${styles.inputField} ${
              errors.name ? styles.error : ""
            }`}
          />
          {errors.name && (
            <span className={styles.errorMessage}>{errors.name.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={`${styles.inputField} ${
              errors.email ? styles.error : ""
            }`}
          />
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className={`${styles.inputField} ${
              errors.password ? styles.error : ""
            }`}
          />
          {errors.password && (
            <span className={styles.errorMessage}>
              {errors.password.message}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className={`${styles.inputField} ${
              errors.confirmPassword ? styles.error : ""
            }`}
          />
          {errors.confirmPassword && (
            <span className={styles.errorMessage}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {password && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
            <span className={styles.progressText}>
              {passwordStrength === 100
                ? "Passwords match"
                : "Password strength"}
            </span>
          </div>
        )}

        {reduxError && !toast.isActive("registration-error") && (
          <div className={styles.errorMessage}>{reduxError}</div>
        )}

        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary} ${
            isLoading ? styles.loading : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "REGISTER"}
        </button>

        <Link to="/login" className={`${styles.btn} ${styles.btnSecondary}`}>
          LOG IN
        </Link>
      </form>
    </div>
  );
};

export default RegisterForm;
