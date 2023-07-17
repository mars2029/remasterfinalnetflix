/// HTML + CSS의 반응형 웹

import React from "react";
import "./HeaderBasic.css";

import { FaAccusoft, FaBars, FaTwitter, FaFacebook } from "react-icons/fa";

export default function HeaderBasic() {
  const onClickBurger = (event: React.MouseEvent<HTMLButtonElement>) => {
    const menu = document.querySelector(".navbar__menu");
    const icons = document.querySelector(".navbar__icons");
    menu?.classList.toggle("active");
    icons?.classList.toggle("active");

    return;
  };
  return (
    <>
      <nav className="navbar">
        <div className="navbar__logo">
          <a href="#1" className="a_text">
            <FaAccusoft></FaAccusoft> DreamCoding
          </a>
        </div>

        <ul className="navbar__menu">
          <li>
            <a href="#1" className="a_text">
              Home
            </a>
          </li>
          <li>
            <a href="#1" className="a_text">
              Gallery
            </a>
          </li>
          <li>
            <a href="#1" className="a_text">
              Weddings
            </a>
          </li>
          <li>
            <a href="#1" className="a_text">
              FAQ
            </a>
          </li>
          <li>
            <a href="#1" className="a_text">
              Bookings
            </a>
          </li>
        </ul>

        <ul className="navbar__icons">
          <li>
            <FaTwitter></FaTwitter>
          </li>
          <li>
            <FaFacebook></FaFacebook>
          </li>
        </ul>

        <button
          style={{ backgroundColor: "transparent", border: "none" }}
          onClick={onClickBurger}
          className="navbar__toggleBtn"
        >
          <FaBars></FaBars>
        </button>
      </nav>
    </>
  );
}
