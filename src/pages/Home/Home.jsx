import React, { useState, useEffect } from "react";
import Signup from "../../components/SignUp/SignUp";
import Login from "../../components/Login/Login";
import style from "./Style.module.css";
import { useParams } from "react-router-dom";

const Home = () => {
  const { display } = useParams();

  const [selectedButton, setSelectedButton] = useState("");
  const [displayComponent, setDisplayComponent] = useState("");

  useEffect(() => {
    if (display === "login") {
      setDisplayComponent("login");
      setSelectedButton("login");
    } else {
      setDisplayComponent("signup");
      setSelectedButton("signup");
    }
  }, [display]);

  const handleButtonClick = (component) => {
    setDisplayComponent(component);
    setSelectedButton(component);
  };

  return (
    <div className={style.container}>
      <h2>QUIZZIE</h2>
      <div className={style.login_signup_btn}>
        <button
          className={`${style.signUp} ${selectedButton === "signup" ? style.selected : ""
            }`}
          onClick={() => handleButtonClick("signup")}
        >
          Sign Up
        </button>
        <button
          className={`${style.signUp} ${selectedButton === "login" ? style.selected : ""
            }`}
          onClick={() => handleButtonClick("login")}
        >
          Login
        </button>
      </div>
      <div className={style.signup_page}>
        {displayComponent === "signup" && <Signup />}
        {displayComponent === "login" && <Login />}
      </div>
    </div>
  );
};

export default Home;
