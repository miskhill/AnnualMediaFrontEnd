import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import "../navbar.css";

export default function Navbar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const brandNameStyle = {
    fontFamily: "Bebas Neue, sans-serif",
    fontSize: "50px",
    fontWeight: "bold",
    letterSpacing: "-2px",
    textDecoration: "none",
    color: "#e50914",
    textShadow: "2px 2px 0 #000000",
  };

  const closeNav = () => setIsNavExpanded(false);

  const handleLogout = () => {
    closeNav();
    logout();
    navigate("/login", { replace: true });
  };

  const linkClassName = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className='navigation'>
      <NavLink
        to='/'
        onClick={closeNav}
        className='brand-name'
        style={brandNameStyle}
      >
        ANNUAL MEDIA
      </NavLink>

      <button
        className='hamburger'
        onClick={() => {
          setIsNavExpanded((prev) => !prev);
        }}
        type='button'
        aria-label='Toggle navigation menu'
      >
        <svg viewBox='5 0 100 80' width='40' height='25'>
          <rect width='60' height='20'></rect>
          <rect y='30' width='60' height='20'></rect>
          <rect y='60' width='60' height='20'></rect>
        </svg>
      </button>
      <div
        className={
          isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
        }
      >
        <ul>
          <li>
            <NavLink to='/movies' className={linkClassName} onClick={closeNav}>
              Movies
            </NavLink>
          </li>
          <li>
            <NavLink to='/series' className={linkClassName} onClick={closeNav}>
              Series
            </NavLink>
          </li>
          <li>
            <NavLink to='/books' className={linkClassName} onClick={closeNav}>
              Books
            </NavLink>
          </li>
          <li>
            <button type='button' className='logout-button' onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
