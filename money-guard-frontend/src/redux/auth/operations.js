import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUser } from "./authSlice";

axios.defaults.baseURL = "https://wallet.b.goit.study/api";

const token = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset() {
    axios.defaults.headers.common.Authorization = "";
  },
};

export const logIn = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post("/auth/sign-in", credentials);
      token.set(data.token);
      dispatch(setUser({ user: data.user, token: data.token }));
      return data;
    } catch (error) {
      alert(
        error.response.data.message ||
          "An error occurred during login. Please try again."
      );
      return rejectWithValue(error.message);
    }
  }
);
