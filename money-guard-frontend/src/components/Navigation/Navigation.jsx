import React, { useState, useCallback, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaHome, FaThinkPeaks , FaExchangeAlt   } from "react-icons/fa";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();


  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  const getNavLinkClass = useCallback(({ isActive }) => {
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  }, []);

  const menuClasses = `${styles.navMenu} ${isMenuOpen ? styles.menuOpen : ""}`;

  return (
    <nav className={styles.navbar} role='navigation'>
      <div className={styles.navbarContainer}>
        <ul className={`${menuClasses} ${styles.menuList}`}>
          <li className={styles.navItem}>
            <NavLink
              to='/dashboard/home'
              className={getNavLinkClass}
              onClick={closeMenu}
              end
            >
              <FaHome className={styles.navigationIcon}/> Home
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink
              to='/dashboard/statistics'
              className={getNavLinkClass}
              onClick={closeMenu}
            >
              <FaThinkPeaks className={styles.navigationIcon}/> Statistics
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink
              to='/dashboard/currency'
              className={getNavLinkClass}
              onClick={closeMenu}
            >
             <FaExchangeAlt className={styles.navigationIcon}/> Currency
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
