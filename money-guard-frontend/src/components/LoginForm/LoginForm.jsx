import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { logIn } from "../../redux/auth/operations";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import css from "./LoginForm.module.css";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address.")
    .required("Email is required."),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(12, "Password must be at most 12 characters.")
    .required("Password is required."),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const resultAction = await dispatch(logIn(data));

    if (logIn.fulfilled.match(resultAction)) {
      toast.success("Login successful! You are being redirected...");
      navigate("/dashboard");
    } else {
      const errorMessage =
        resultAction.payload?.message || "Email or password is incorrect.";
      toast.error(errorMessage);
      console.error("Login Failed:", resultAction.payload);
    }
  };

  return (
    <div className={"container"}>
      <div className={css.formContainer}>
        <img
          src="/headerlogo.svg"
          alt="Money Guard Logo"
          className={css.loginLogo}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={css.loginForm}
          noValidate
        >
          <div className={css.inputContainer}>
            <FaEnvelope className={css.icon} />
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`${css.formInput} ${errors.email ? "error" : ""}`}
              autoComplete="email"
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
              className={`${css.formInput} ${errors.password ? "error" : ""}`}
              {...register("password")}
              autoComplete="current-password"
            />
            {errors.password && (
            <span className={"errorMessage"}>{errors.password.message}</span>
          )}
          </div>
          <div className={css.buttonGroup}>
            <button type="submit" className={"gradientBtn"}>
              Log In
            </button>
            <Link to="/register" className={"whiteBtn"}>
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
