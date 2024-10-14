import { useState } from "react";
import "../navbar.css";

export default function Navbar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);


  const brandNameStyle = {
    fontFamily:"Bebas Neue, sans-serif",
    fontSize: "50px",
    fontWeight: "bold",
    letterSpacing: "-2px",
    textDecoration: "none",
    color: "#e50914",
    textShadow: "2px 2px 0 #000000",
  };

  return (
    <nav className='navigation'>
      <a
        href='/'
        className='brand-name'
        style={brandNameStyle}
      >
        ANNUAL MEDIA
      </a>

      <button
        className='hamburger'
        onClick={() => {
          setIsNavExpanded(!isNavExpanded);
        }}
      >
        {/* hamburger svg code... */}
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
            <a href='/movies'>Movies</a>
          </li>
          <li>
            <a href='/series'>Series</a>
          </li>
          <li>
            <a href='/books'>Books</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
