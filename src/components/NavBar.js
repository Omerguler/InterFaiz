import React from "react";
import "./Home.css";
export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-sm mb-5">
      <div
        style={{ height: 110 }}
        className="container d-flex justify-content-center"
      >
        <a href="https://www.intertech.com.tr">
          <img
            src="https://www.intertech.com.tr/wp-content/uploads/2017/12/intertech_web_logo.png"
            width="230"
            height="50"
            className="d-inline-block align-top"
            alt=""
          />
        </a>
        <a className="navbar-brand align-top" href="/">
          FAİZ HESAPLAMA SİMÜLASYONU
        </a>
      </div>
    </nav>
  );
}
