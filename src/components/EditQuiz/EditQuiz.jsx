import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import style from "./Style.module.css";
import { server } from "../../App";

const EditQuiz = ({ quizData, handleClosePopup }) => {
  const [formData, setFormData] = useState(quizData);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    setFormData(quizData);
  }, [quizData]);

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question: e.target.value,
    };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex].option =
      e.target.value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSubmit = async () => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      toast.error("Login to create a Quiz");
      return;
    }
    try {
      const response = await axios.patch(
        `${server}api/quiz/editQuiz/${formData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Quiz Updated Successfully!");
        handleClosePopup();
      } else {
        console.error("Error updating quiz:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  const handleRemove = () => {
    handleClosePopup();
  };

  return (
    <>
      <div className={style.question_container}>
        <div>
          <div className={style.ellipse}>
            {formData.questions.map((question, index) => (
              <div key={index}>
                <button
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={style.ellipse_index}
                >
                  {index + 1}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={style.ques_container}>
          <input
            type="text"
            value={formData.questions[currentQuestionIndex].question}
            onChange={(e) => handleQuestionChange(currentQuestionIndex, e)}
            placeholder="Poll Question"
            className={style.question_input}
          />
          <br />

          {formData.questions[currentQuestionIndex].options.map(
            (option, optionIndex) => (
              <div key={optionIndex}>
                <input
                  type="text"
                  placeholder="Text"
                  value={option.option}
                  onChange={(e) =>
                    handleOptionChange(currentQuestionIndex, optionIndex, e)
                  }
                />
              </div>
            )
          )}

          <div>
            <button className={style.update_btn} onClick={handleSubmit}>
              Update Quiz
            </button>
            <button className={style.cancel_btn} onClick={handleRemove}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditQuiz;
