import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { logIn } from "../../redux/auth/operations";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from 'react-icons/fa';
import css from './LoginForm.module.css';
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
    try {
      const resultAction = await dispatch(logIn(data));

      if (logIn.fulfilled.match(resultAction)) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed on component level:", error);
    }
  };

  return (
    <div className={"container"}>
      <div className={css.formContainer}>
        <img src="/headerlogo.svg" alt="" className={css.loginLogo}/>
        <form onSubmit={handleSubmit(onSubmit)} className={css.loginForm}>
          <div className={css.inputContainer}>
            <FaEnvelope />
            <input type="email" placeholder="Email" {...register("email")} className={css.formInput} />
            <p style={{ color: "red" }}>{errors.email?.message}</p>
          </div>
          <div className={css.inputContainer}>
            <FaLock />
            <input type="password" placeholder="Password" className={css.formInput} {...register("password")} />
            <p style={{ color: "red" }}>{errors.password?.message}</p>
          </div>
          <div className={css.buttonGroup}>
            <button type="submit" className={css.loginBtn}>Log In</button>
            <Link to="/register" className={css.registerBtn}>Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
