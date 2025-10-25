import css from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/auth/operations";
import { useState } from "react";
import LogoutModal from "../LogoutModal/LogoutModal";

const Header = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const username = useSelector((state) => state.user.user.username);

  const handleLogOutClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmLogout = () => {
    dispatch(logOut());
    setIsModalOpen(false);
  };

  const handleCancelLogout = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <header className={css.header}>
        <div className={css.container}>
          <img
            src="/headerlogo.svg"
            alt="Money Guard Logo"
            className={css.logo}
          />
          <div className={css.user}>
            <span>{username || "User"}</span>

            <a href="/" onClick={handleLogOutClick} className={css.userExit}>
              <img src="/exitlogo.svg" alt="Exit icon" />
              <span className={css.exitText}>Exit</span>
            </a>
          </div>
        </div>
      </header>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Header;