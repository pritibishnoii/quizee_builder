import React, { useState, useEffect } from "react";
import axios from "axios";
import eye_logo from "../../assets/eye.png";
import style from "./Style.module.css";
import { server } from "../../App";

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [totalQuizImpressions, setTotalQuizImpressions] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const quizResponse = await axios.get(
          `${server}api/quiz/quizzesWithImpressions/${userId}`
        );
        const fetchedQuizzes = quizResponse.data.quizzes;
        const totalQuizImpressions = fetchedQuizzes.reduce(
          (total, quiz) => total + quiz.impressionofQuiz,
          0
        );

        setTotalQuizImpressions(totalQuizImpressions);
        setQuizzes(fetchedQuizzes);

        const questionResponse = await axios.get(
          `${server}api/quiz/questionCount/${userId}`
        );
        setQuestionCount(questionResponse.data.questionCount);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboardData();
  }, []);

  function formatDate(dateString) {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <div className={style.dashboard_container}>
      <div className={style.dashboard_stats_container}>
        <div className={style.dashboard_stats_card}>
          <div className={style.quiz_created}>{quizzes.length} <span className={style.quiz_created_text}> Quiz <br /> Created</span></div>

        </div>

        <div className={style.dashboard_stats_card}>
          <div className={style.questions_created}>{questionCount} <span span className={style.questions_created_text}>questions Created</span></div>

        </div>

        <div className={style.dashboard_stats_card}>
          <div className={style.quiz_impression_created}>
            {totalQuizImpressions} <span span className={style.quiz_impression_created_text}>Total Impressions{" "}</span>
          </div>

        </div>
      </div>
      <div className={style.dashboard_trending_quizzes_container}>
        <div className={style.dashboard_trending_quizzes_title}>
          Trending Quizs
        </div>

        <div className={style.dashboard_quiz_cards_container}>
          {quizzes.map((quiz) =>
            quiz.impressionofQuiz < 11 ? (
              <></>
            ) : (
              <div key={quiz._id} className={style.dashboard_quiz_card}>
                <div className={style.dashboard_quiz_card_text}>
                  {quiz.quizName}
                </div>
                <div className={style.dashboard_quiz_card_num}>
                  {quiz.impressionofQuiz}
                  <img
                    className={style.eye_img}
                    src={eye_logo}
                    alt="eye-logo"
                  />
                </div>
                <p className={style.dashboard_quiz_stats_text}>
                  Created on: {formatDate(quiz.date)}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
