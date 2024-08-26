import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "./Style.module.css";
import cross_logo from "../../assets/charm_cross.png";
import delete_logo from "../../assets/delete.png";
import plus_logo from "../../assets/plus.png";
import { toast } from "react-hot-toast";
import { server } from "../../App";

const CreateQuiz = ({ handleClosePopup }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuizDetails, setShowQuizDetails] = useState(true);
  const [quizPublished, setQuizPublished] = useState(false);

  const [quizData, setQuizData] = useState({
    userId: localStorage.getItem("userId"),
    quizName: "",
    quizType: "",
    numQuestions: 1,
    questions: [
      {
        question: "",
        options: [
          { option: "", impressionofOption: 0 },
          { option: "", impressionofOption: 0 },
        ],
        correctOption: null,
        optionType: "text",
        timer: "OFF",
        impressionofQuestion: 0,
      },
    ],
    quizId: null,
    impressionofQuiz: 0,
  });

  useEffect(() => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((question) => ({
        ...question,
        optionType: "text",
        timer: "OFF",
      })),
    }));
  }, []);

  const handleQuizNameChange = (e) => {
    setQuizData({ ...quizData, quizName: e.target.value });
  };

  const handleQuizTypeChange = (selectedType) => {
    setQuizData({ ...quizData, quizType: selectedType });
  };

  const handleOptionTypeChange = (questionIndex, e) => {
    const updatedQuestions = [...quizData.questions];
    if (!updatedQuestions[questionIndex]) {
      updatedQuestions[questionIndex] = {
        question: "",
        options: [
          { option: "", impressionofOption: 0 },
          { option: "", impressionofOption: 0 },
        ],
        correctOption: null,
        optionType: "",
        timer: "",
      };
    }
    updatedQuestions[questionIndex].optionType = e.target.value;

    updatedQuestions[questionIndex].options = [
      { option: "", impressionofOption: 0 },
      { option: "", impressionofOption: 0 },
    ];
    updatedQuestions[questionIndex].correctOption = null;

    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleTimerChange = (questionIndex, e) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].timer = e.target.value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question: e.target.value,
    };
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options[optionIndex].option =
      e.target.value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionCombinedChange = (questionIndex, optionIndex, e) => {
    const updatedQuestions = [...quizData.questions];
    const oldvalue =
      updatedQuestions[questionIndex].options[optionIndex].option;
    const splitStrings = oldvalue.split("***");
    let firstString = splitStrings[0]?.trim() || "";
    let secondString = splitStrings[1]?.trim() || "";
    const firstChild = e.target.parentElement.children[0];
    const secondChild = e.target.parentElement.children[1];
    if (e.target === firstChild) {
      firstString = firstChild.value;
    } else {
      secondString = secondChild.value;
    }
    const value = firstString + "***" + secondString;
    updatedQuestions[questionIndex].options[optionIndex].option = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].correctOption = optionIndex;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setCurrentQuestionIndex(quizData.numQuestions);
    setQuizData({
      ...quizData,
      numQuestions: quizData.numQuestions + 1,
      questions: [
        ...quizData.questions,
        {
          question: "",
          options: [
            { option: "", impressionofOption: 0 },
            { option: "", impressionofOption: 0 },
          ],
          correctOption: null,
          optionType: "text",
          timer: "OFF",
        },
      ],
    });
  };

  const handleRemoveQuestion = (index) => {
    if (index > 0 && index <= quizData.numQuestions - 1) {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions.splice(index, 1);
      setQuizData({
        ...quizData,
        numQuestions: quizData.numQuestions - 1,
        questions: updatedQuestions,
      });
      setCurrentQuestionIndex(
        Math.min(currentQuestionIndex, quizData.numQuestions - 2)
      );
    }
  };

  const handleContinue = () => {
    if (quizData.quizName.trim() === "" || quizData.quizType.trim() === "") {
      toast.error("Please fill in all required fields.");
      return;
    }

    setShowQuizDetails(false);
  };

  const handleTabClick = (index) => {
    if (index >= 0 && index < quizData.numQuestions) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleAddOption = (questionIndex) => {
    if (quizData.questions[questionIndex].options.length < 4) {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions[questionIndex].options.push({
        option: "",
        impressionofOption: 0,
      });
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    if (quizData.questions[questionIndex].options.length > 2) {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  const handleSubmit = async () => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      toast.error("Login to create a Quiz");
      return;
    }
    const currentQuestion = quizData.questions[currentQuestionIndex];
    if (
      currentQuestion.question.trim() === "" ||
      currentQuestion.options.some((option) => option.option.trim() === "") ||
      (quizData.quizType === "qa" && currentQuestion.correctOption === null) ||
      currentQuestion.optionType.trim() === "" ||
      (quizData.quizType === "qa" && currentQuestion.timer.trim() === "")
    ) {
      toast.error(
        "Please fill in all required fields for the current question."
      );
      return;
    }

    try {
      const response = await axios.post(
        `${server}api/quiz/createQuiz`,
        quizData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        setQuizData({ ...quizData, quizId: response.data.quizId });
        setQuizPublished(true);
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("An error occurred while submitting the quiz.");
    }
  };

  const copyQuizLink = () => {
    const inputElement = document.getElementById("quizLinkInput");
    inputElement.select();
    document.execCommand("copy");
    toast.success("Link copied to Clipboard");
  };

  return (
    <>
      {showQuizDetails && (
        <div className={style.container}>
          <input
            type="text"
            placeholder="Quiz name "
            value={quizData.quizName}
            onChange={handleQuizNameChange}
            className={style.quizName}
          />
          <br />

          <label className={style.quiz_type}>
            Quiz Type
            <div>
              <button
                onClick={() => handleQuizTypeChange("qa")}
                className={`${style.type_button} ${quizData.quizType === "qa" ? style.selected : ""
                  }`}
              >
                Q&A
              </button>
              <button
                onClick={() => handleQuizTypeChange("poll")}
                className={`${style.type_button} ${quizData.quizType === "poll" ? style.selected : ""
                  }`}
              >
                Poll Type
              </button>
            </div>
          </label>

          <br />

          <button onClick={handleClosePopup} className={style.cancle_btn}>
            Cancel
          </button>

          <button onClick={handleContinue} className={style.continue_btn}>
            Continue
          </button>
        </div>
      )}

      <div className={style.question_container}>
        {!showQuizDetails && !quizPublished && (
          <>
            <div>
              <div className={style.ellipse_container}>
                {quizData.questions.map((question, index) => (
                  <div key={index}>
                    <button
                      onClick={() => handleTabClick(index)}
                      className={style.ellipse_index}
                    >
                      {index + 1}
                    </button>
                    {index > 0 && index <= quizData.numQuestions - 1 && (
                      <button
                        onClick={() => handleRemoveQuestion(index)}
                        className={style.cross_btn}
                      >
                        <img src={cross_logo} alt="cross_logo" />
                      </button>
                    )}
                  </div>
                ))}
                {quizData.questions.length < 5 && (
                  <button className={style.plus} onClick={handleAddQuestion}>
                    <img src={plus_logo} alt="plus_logo" />
                  </button>
                )}
              </div>
              <label className={style.max_ques}>Max 5 questions</label>
            </div>

            <div className={style.question_container}>
              <input
                type="text"
                value={quizData.questions[currentQuestionIndex].question}
                onChange={(e) => handleQuestionChange(currentQuestionIndex, e)}
                placeholder="Poll Question"
                className={style.question_input}
              />
              <br />
              <label>
                Option Type
                <div className={style.optionType_label}>
                  <label>
                    <input
                      type="radio"
                      value="text"
                      checked={
                        quizData.questions[currentQuestionIndex].optionType ===
                        "text"
                      }
                      onChange={(e) =>
                        handleOptionTypeChange(currentQuestionIndex, e)
                      }
                    />
                    Text
                  </label>

                  <label>
                    <input
                      type="radio"
                      value="image"
                      checked={
                        quizData.questions[currentQuestionIndex].optionType ===
                        "image"
                      }
                      onChange={(e) =>
                        handleOptionTypeChange(currentQuestionIndex, e)
                      }
                    />
                    Image URL
                  </label>

                  <label>
                    <input
                      type="radio"
                      value="both"
                      checked={
                        quizData.questions[currentQuestionIndex].optionType ===
                        "both"
                      }
                      onChange={(e) =>
                        handleOptionTypeChange(currentQuestionIndex, e)
                      }
                    />
                    Text & Image URL
                  </label>
                </div>
              </label>

              {[
                ...Array(
                  quizData.questions[currentQuestionIndex].options.length || 2
                ),
              ].map((_, optionIndex) => (
                <div className={style.options_container}>
                  <div key={optionIndex}>
                    {quizData.quizType === "qa" && (
                      <input
                        type="radio"
                        name={`correctOption-${currentQuestionIndex}`}
                        checked={
                          quizData.questions[currentQuestionIndex]
                            .correctOption === optionIndex
                        }
                        onChange={() =>
                          handleCorrectAnswerChange(
                            currentQuestionIndex,
                            optionIndex
                          )
                        }
                      />
                    )}

                    {quizData.questions[currentQuestionIndex].optionType ===
                      "both" ? (
                      <div className={style.text_image}>
                        <input
                          type="text"
                          placeholder="Text"
                          value={
                            quizData.questions[currentQuestionIndex]?.options[
                              optionIndex
                            ]?.option.split("***")[0] || ""
                          }
                          onChange={(e) =>
                            handleOptionCombinedChange(
                              currentQuestionIndex,
                              optionIndex,
                              e
                            )
                          }
                          className={`${quizData.quizType === "qa" ? style.text_image_qa : style.text_image_poll} ${quizData.questions[currentQuestionIndex].correctOption === optionIndex ? style.selected : style.txt_img
                            }`}
                        />
                        <input
                          type="link"
                          placeholder="Image URL"
                          value={
                            quizData.questions[currentQuestionIndex]?.options[
                              optionIndex
                            ]?.option
                              .split("***")[1]
                              ?.trim() || ""
                          }
                          onChange={(e) =>
                            handleOptionCombinedChange(
                              currentQuestionIndex,
                              optionIndex,
                              e
                            )
                          }
                          className={`${quizData.quizType === "qa" ? style.text_image_qa : style.text_image_poll} ${quizData.questions[currentQuestionIndex].correctOption === optionIndex ? style.selected : style.txt_img
                            }`}
                        />
                      </div>
                    ) : quizData.questions[currentQuestionIndex].optionType ===
                      "text" ? (
                      <input
                        type="text"
                        placeholder="Text"
                        value={
                          quizData.questions[currentQuestionIndex].options[
                            optionIndex
                          ]?.option || ""
                        }
                        onChange={(e) =>
                          handleOptionChange(
                            currentQuestionIndex,
                            optionIndex,
                            e
                          )
                        }
                        className={
                          quizData.questions[currentQuestionIndex]
                            .correctOption === optionIndex
                            ? style.selected
                            : ""
                        }
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={
                          quizData.questions[currentQuestionIndex].options[
                            optionIndex
                          ]?.option || ""
                        }
                        onChange={(e) =>
                          handleOptionChange(
                            currentQuestionIndex,
                            optionIndex,
                            e
                          )
                        }
                        className={
                          quizData.questions[currentQuestionIndex]
                            .correctOption === optionIndex
                            ? style.selected
                            : ""
                        }
                      />
                    )}
                  </div>

                  <div>
                    {optionIndex > 1 && (
                      <button
                        onClick={() =>
                          handleRemoveOption(currentQuestionIndex, optionIndex)
                        }
                        className={style.delete_btn}
                      >
                        <img src={delete_logo} alt="delete_logo" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {quizData.questions[currentQuestionIndex].options.length < 4 && (
                <button
                  onClick={() => handleAddOption(currentQuestionIndex)}
                  className={style.addOption_btn}
                >
                  Add Option
                </button>
              )}

              <div className={style.timer_container}>
                {quizData.quizType !== "poll" && (
                  <div>
                    <label>Timer</label>
                    <div>
                      <button
                        className={`${style.timerButton} ${quizData.questions[currentQuestionIndex].timer ===
                          "OFF"
                          ? style.selectedButton
                          : ""
                          }`}
                        value="OFF"
                        onClick={(e) =>
                          handleTimerChange(currentQuestionIndex, e)
                        }
                        checked={
                          quizData.questions[currentQuestionIndex].timer ===
                          "Off"
                        }
                      >
                        OFF
                      </button>
                      <br />

                      <button
                        className={`${style.timerButton} ${quizData.questions[currentQuestionIndex].timer ===
                          "5sec"
                          ? style.selectedButton
                          : ""
                          }`}
                        value="5sec"
                        onClick={(e) =>
                          handleTimerChange(currentQuestionIndex, e)
                        }
                        checked={
                          quizData.questions[currentQuestionIndex].timer ===
                          "5sec"
                        }
                      >
                        5sec
                      </button>
                      <br />

                      <button
                        className={`${style.timerButton} ${quizData.questions[currentQuestionIndex].timer ===
                          "10sec"
                          ? style.selectedButton
                          : ""
                          }`}
                        value="10sec"
                        onClick={(e) =>
                          handleTimerChange(currentQuestionIndex, e)
                        }
                        checked={
                          quizData.questions[currentQuestionIndex].timer ===
                          "10sec"
                        }
                      >
                        10sec
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button onClick={handleClosePopup} className={style.cancle_btn}>
              Cancel
            </button>

            <button onClick={handleSubmit} className={style.continue_btn}>
              Create Quiz
            </button>
          </>
        )}

        {quizPublished && (
          <div className={style.quiz_published}>
            <button onClick={handleClosePopup} className={style.cross_btn_2}>
              <img src={cross_logo} alt="cross_logo" />
            </button>
            <h3>Congrats your Quiz is Published!</h3>
            <p>
              <input
                placeholder="your link is here"
                type="text"
                value={`http://localhost:3000/livequiz/${quizData.quizId}`}
                readOnly
                className={style.link_input}
                id="quizLinkInput"
              />
            </p>
            <button onClick={copyQuizLink} className={style.share_btn}>
              Share
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateQuiz;
