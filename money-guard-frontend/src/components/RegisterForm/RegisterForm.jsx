import css from "./RegisterForm.module.css";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "../../redux/auth/operations";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaRegUser } from "react-icons/fa";

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
      const errorMessage = error.message || "Email already in use.";

      toast.error(errorMessage);

      console.error("Registration failed:", error);
    }
  };

  return (
    <div className={css.container}>
      <div className={css.registerContainer}>
        <img src="/headerlogo.svg" alt="" className={css.registerLogo}/>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={css.registerForm}
          noValidate
        >
          <div className={css.inputContainer}>
            <FaRegUser />
            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              className={`${css.inputField} ${errors.name ? "error" : ""}`}
            />
            {errors.name && (
              <span className={"errorMessage"}>{errors.name.message}</span>
            )}
          </div>

          <div className={css.inputContainer}>
            <FaEnvelope className={css.icon} />
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`${css.inputField} ${errors.email ? "error" : ""}`}
            />
            {errors.email && (
              <span className={"errorMessage"}>{errors.email.message}</span>
            )}
          </div>

          <div className={css.inputContainer}>
            <FaLock className={css.icon} />
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`${css.inputField} ${
                errors.password ? "error" : ""
              }`}
            />
            {errors.password && (
              <span className={"errorMessage"}>
                {errors.password.message}
              </span>
            )}
          </div>

          <div className={css.inputContainer}>
            <FaLock className={css.icon} />
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className={`${css.inputField} ${
                errors.confirmPassword ? "error" : ""
              }`}
            />
            {errors.confirmPassword && (
              <span className={"errorMessage"}>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {password && (
            <div className={css.progressContainer}>
              <div className={css.progressBar}>
                <div
                  className={css.progressFill}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
              <span className={css.progressText}>
                {passwordStrength === 100
                  ? "Passwords match"
                  : "Password strength"}
              </span>
            </div>
          )}

          {reduxError && !toast.isActive("registration-error") && (
            <div className={css.errorMessage}>{reduxError}</div>
          )}

          <div className={css.buttonGroup}>
            <button
              type="submit"
              disabled={isLoading}
             className={"gradientBtn"}
            >
              {isLoading ? "Registering..." : "REGISTER"}
            </button>

            <Link to="/login" className={"whiteBtn"}>
              LOG IN
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
