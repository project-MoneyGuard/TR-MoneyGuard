import css from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/auth/operations";

const Header = () => {
  const dispatch = useDispatch();

  const username = useSelector((state) => state.user.user.username);

  const handleLogOut = (e) => {
    e.preventDefault();
    dispatch(logOut());
  };

  return (
    <header className={css.header}>
      <div className={css.container}>
        <img
          src="/headerlogo.svg"
          alt="Money Guard Logo"
          className={css.logo}
        />
        <div className={css.user}>
          <span>{username || "User"}</span>

          <a href="/" onClick={handleLogOut} className={css.userExit}>
            <img src="/exitlogo.svg" alt="Exit icon" />
            <span className={css.exitText}>Exit</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
