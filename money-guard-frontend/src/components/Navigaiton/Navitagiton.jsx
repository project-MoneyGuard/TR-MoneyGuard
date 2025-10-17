import React, { useState, useCallback, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

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
        <NavLink to='/' className={styles.navbarLogo} onClick={closeMenu}>
          Navigation
        </NavLink>

        <button
          className={styles.menuIcon}
          onClick={toggleMenu}
          aria-label='Toggle menu'
          aria-expanded={isMenuOpen}
        >
          ☰
        </button>

        <ul className={menuClasses}>
          <li className={styles.navItem}>
            <NavLink
              to='/home'
              className={getNavLinkClass}
              onClick={closeMenu}
              end
            >
              Home
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink
              to='/statistics'
              className={getNavLinkClass}
              onClick={closeMenu}
            >
              Statistics
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink
              to='/currency'
              className={getNavLinkClass}
              onClick={closeMenu}
            >
              Currency
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
