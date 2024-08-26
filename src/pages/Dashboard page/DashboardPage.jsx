import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../components/Dashboard/Dashboard";
import CreateQuiz from "../../components/CreateQuiz/CreateQuiz";
import QuizAnalysis from "../../components/QuizAnalysis/QuizAnalysis";
import style from "./Style.module.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const savedActiveTab = localStorage.getItem("activeTab");
  const [showCreateQuizPopup, setShowCreateQuizPopup] = useState(false);
  const [activeTab, setActiveTab] = useState(
    savedActiveTab ? parseInt(savedActiveTab) : 1
  );

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab.toString());
  }, [activeTab]);

  const handleCreateQuizClick = () => {
    setShowCreateQuizPopup(true);
  };

  const handleClosePopup = () => {
    setShowCreateQuizPopup(false);
  };

  return (
    <div className={style.main}>

      <div className={style.dashboard_sidebar}>
        <h3>QUIZZIE</h3>
        <div>
          <button
            onClick={() => setActiveTab(1)}
            className={`${style.button} ${activeTab === 1 && style.active}`}
          >
            Dashboard
          </button>{" "}
          <br />
          <button
            onClick={() => (activeTab === 4 ? setActiveTab(2) : setActiveTab(4))}
            className={`${style.button} ${(activeTab === 2 || activeTab === 4) && style.active}`}
          >
            Analytics
          </button>{" "}
          <br />
          <button
            onClick={handleCreateQuizClick}
            className={`${style.button} ${activeTab === 3 && style.active}`}
          >
            Create Quiz
          </button>{" "}
        </div>
        <br />
        <div className={style.line}></div>
        <button onClick={handleLogout} className={style.logout_btn}>
          Logout
        </button>
      </div>

      <div className={style.dashboard_content}>
        {activeTab === 1 && <Dashboard />}
        {activeTab === 2 && <QuizAnalysis quizId={Math.random() * 10000} />}
        {activeTab === 4 && <QuizAnalysis quizId={Math.random() * 10000} />}
        {activeTab === 3 && <CreateQuiz />}
      </div>
      {showCreateQuizPopup && (
        <div className={style.createquiz_popup}>
          <div className={style.create_quiz}>
            <CreateQuiz handleClosePopup={handleClosePopup} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
