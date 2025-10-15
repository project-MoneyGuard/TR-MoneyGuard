import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
// import { logIn } from "../redux/auth/authOperations";
import { Link, useNavigate } from "react-router-dom";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>E-mail</label>
        <input type="email" {...register("email")} />
        <p style={{ color: "red" }}>{errors.email?.message}</p>
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register("password")} />
        <p style={{ color: "red" }}>{errors.password?.message}</p>
      </div>
      <button type="submit">Log In</button>
      <Link to="/register">Register</Link>
    </form>
  );
};

export default LoginForm;
