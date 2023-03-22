import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Quiz.css";
import axios from "axios";
const LOGOUT_URL = "http://localhost:8000/api/v1/users/logout";
const QUESTIONS_URL = "http://localhost:8000/api/v1/questions";

const Quiz = () => {
  const navigate = useNavigate();
  // Properties
  const [questions, setQuestions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(1);

  const submitHandler = async () => {
    setShowResults(true);
    await axios.post(
      "http://localhost:8000/api/v1/users/saveScore",
      { score },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  };

  let timer;
  useEffect(() => {
    timer = setInterval(() => {
      if (seconds > 0) setSeconds(seconds - 1);

      if (seconds === 0) {
        if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          clearInterval(timer);
          submitHandler();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await axios.get(QUESTIONS_URL, {
          withCredentials: true,
        });
        setQuestions(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchQuestions();
  }, []);

  /* A possible answer was clicked */
  const optionClicked = (isCorrect) => {
    // Increment the score
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion + 1 < 10) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  /* Resets the game back to default */
  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
    window.location.reload();
  };

  const logout = async (e) => {
    e.preventDefault();
    await axios.get(LOGOUT_URL, {
      withCredentials: true,
    });
    navigate("/login");
  };

  const userStats = () => {
    navigate("/quizPreview");
  };

  return (
    <div className="Quiz">
      <h1>SAT QUIZ</h1>
      <div className="timer">
        {minutes === 0 && seconds === 0 ? (
          <h2>Time is Up!!!</h2>
        ) : !showResults ? (
          <h2>
            {minutes > 10 ? minutes : `0${String(minutes)}`}:
            {seconds > 10 ? seconds : `0${String(seconds)}`}
          </h2>
        ) : (
          <h2>Well done!!!</h2>
        )}
      </div>
      <h2>Score: {score}</h2>

      {showResults ? (
        <div className="final-results">
          <h1>Final Results</h1>
          <h2>
            {score} out of 10 correct - ({(score / 10) * 100}%)
          </h2>
          <button onClick={() => restartGame()}>Restart game</button>
          <button onClick={userStats}>Stats</button>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        questions.length && (
          <div className="question-card">
            <h2>Question: {currentQuestion + 1} out of 10</h2>
            <h3 className="question-text">{questions[currentQuestion].text}</h3>

            <ul>
              {questions[currentQuestion].options.map((option) => {
                return (
                  <li
                    key={option.id}
                    onClick={() => {
                      optionClicked(option.isCorrect);
                    }}
                  >
                    {option.text}
                  </li>
                );
              })}
            </ul>
            <button onClick={() => submitHandler()}>Submit</button>
          </div>
        )
      )}
    </div>
  );
};

export default Quiz;
