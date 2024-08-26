import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import trophy_logo from "../../assets/trophy.png";
import style from "./Style.module.css";
import { server } from "../../App";

function LiveQuiz() {
  const { quizId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(
          `${server}api/quiz/get-live-quiz/${quizId}`
        );
        const data = response.data;
        if (data) {
          setQuizData({
            ...data.quiz,
          });
          // console.log(data.quiz.questions[0].timer, "Timer");
          const initialTimer = data.quiz.questions[0].timer;
          setTimer(initialTimer === "OFF" ? null : parseInt(initialTimer));
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (quizCompleted) {
      const sendQuizDataToBackend = async () => {
        try {
          const response = await axios.post(`${server}api/quiz/updateQuiz`, {
            quizData,
          });

          // console.log(response.data);
        } catch (error) {
          console.error("Error sending quiz data to backend:", error);
        }
      };

      sendQuizDataToBackend();
    }
  }, [quizCompleted, quizData]);

  useEffect(() => {
    if (timer !== null && timer !== "OFF" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (quizData && timer === null) {
      const initialTimer = quizData.questions[0].timer;
      setTimer(initialTimer === "OFF" ? null : parseInt(initialTimer));
    }
  }, [quizData, timer]);

  useEffect(() => {
    if (timer === 0 && !quizCompleted) {
      handleNextClick();
    }
  }, [timer, quizCompleted]);

  const handleOptionSelect = (optionIndex) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = [...prevSelectedOptions];
      updatedOptions[currentQuestionIndex] = optionIndex;

      const updatedQuizData = { ...quizData };
      const currentQuestion = updatedQuizData.questions[currentQuestionIndex];
      const selectedOption = currentQuestion.options[optionIndex];
      if (!selectedOption.selected) {
        selectedOption.impressionofOption += 1;
        selectedOption.selected = true;
      }
      setQuizData(updatedQuizData);

      return updatedOptions;
    });
  };

  const handleNextClick = () => {
    if (quizData && currentQuestionIndex < quizData.numQuestions - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

      setTimer(parseInt(quizData.questions[currentQuestionIndex + 1].timer));
    } else {
      setQuizCompleted(true);
    }
  };

  const calculateScore = () => {
    let score = 0;

    const updatedQuizData = { ...quizData };

    const updatedQuestions = updatedQuizData.questions.map(
      (question, index) => {
        const selectedOptionIndex = selectedOptions[index];

        if (selectedOptionIndex !== undefined) {
          question.impressionofQuestion += 1;
          question.options[selectedOptionIndex].impressionofOption += 1;
        }
        if (
          selectedOptionIndex !== undefined &&
          question.correctOption === selectedOptionIndex
        ) {
          question.answeredCorrectly += 1;
          score += 1;
        }
        return question;
      }
    );

    updatedQuizData.questions = updatedQuestions;

    if (!JSON.stringify(quizData) === JSON.stringify(updatedQuizData)) {
      setQuizData(updatedQuizData);
    }

    return score;
  };

  const renderOptions = (options, optionType) => {
    return options.map((currentOption, optionIndex) => (
      <div key={optionIndex} onClick={() => handleOptionSelect(optionIndex)}>
        {optionType === "text" && (
          <div
            className={`${style.text_option} ${
              selectedOptions[currentQuestionIndex] === optionIndex
                ? style.selected
                : ""
            }`}
          >
            {currentOption.option}
          </div>
        )}

        {optionType === "image" && (
          <img
            className={`${style.text_option} ${
              selectedOptions[currentQuestionIndex] === optionIndex
                ? style.selected
                : ""
            }`}
            src={currentOption.option}
            alt="image_option"
          />
        )}
        {optionType === "both" && (
          <div
            className={`${style.both_option} ${
              selectedOptions[currentQuestionIndex] === optionIndex
                ? style.selected
                : ""
            }`}
            style={{ overflow: "hidden" }}
          >
            <div className={style.both_option_text}>
              {currentOption.option.split("***")[0]}
            </div>
            <div className={style.both_option_text}>
              <img
                className={style.both_option_img}
                src={currentOption.option.split("***")[1]}
                alt="option_image"
              />
            </div>
          </div>
        )}
      </div>
    ));
  };

  const renderQuizContent = () => {
    if (!quizData) {
      return <div>Loading...</div>;
    }

    if (quizCompleted && quizData.quizType === "qa") {
      const score = calculateScore();
      return (
        <div className={style.container}>
          <div className={style.main}>
            <p>Congrats Quiz is completed</p>
            <div>
              <img src={trophy_logo} alt="trophy_logo" />
            </div>
            <p>
              Your Score is {score}/{quizData.numQuestions}
            </p>
          </div>
        </div>
      );
    }
    if (quizCompleted && quizData.quizType === "poll") {
      return (
        <div className={style.container}>
          <div className={style.main}>
            <p className={style.poll_msg}>
              Thank you for participating in the Poll
            </p>
          </div>
        </div>
      );
    }

    const currentQuestion = quizData.questions[currentQuestionIndex];

    return (
      <div className={style.container}>
        <div className={style.main}>
          <div className={style.question_index}>{`0${
            currentQuestionIndex + 1
          }/${quizData.numQuestions}`}</div>
          {timer !== null && quizData.quizType === "qa" && (
            <div className={style.timer}>{timer ? timer + "s" : " "}</div>
          )}

          <div className={style.question_text}>{currentQuestion.question}</div>
          <div className={style.options_container}>
            {renderOptions(currentQuestion.options, currentQuestion.optionType)}
          </div>
          <div>
            <button className={style.submit_btn} onClick={handleNextClick}>
              {currentQuestionIndex === quizData.numQuestions - 1
                ? "Submit"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return <>{renderQuizContent()}</>;
}

export default LiveQuiz;
