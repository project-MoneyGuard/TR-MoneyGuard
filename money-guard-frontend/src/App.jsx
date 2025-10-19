import AppRouter from "./components/Router/Router.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshUser } from "./redux/auth/operations";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return (
    <div>
      <AppRouter />

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}

export default App;
