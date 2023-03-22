import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const LOGOUT_URL = "http://localhost:8000/api/v1/users/logout";

const QuizPreview = () => {
  const navigate = useNavigate();
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [avg, setAvg] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const getUserStats = async () => {
      const stats = (
        await axios.get("http://localhost:8000/api/v1/users/stats", {
          withCredentials: true,
        })
      ).data;
      setMin(stats.min);
      setMax(stats.max);
      setAvg(stats.avg);
      setAttempts(stats.attempts);
      setUsername(stats.name);
    };
    getUserStats();
  }, []);

  const startClickHandler = (e) => {
    e.preventDefault();
    navigate("/quiz");
  };

  const logoutClickHandler = async (e) => {
    e.preventDefault();
    await axios.get(LOGOUT_URL, {
      withCredentials: true,
    });
    navigate("/login");
  };

  return (
    <div className="container">
      <h1>Read carefully the following before starting the quiz:</h1>
      <ul className="myList">
        <li>
          When you press the start button you have exactly 1 minute to submit
          your answers.
        </li>
        <li>
          If you don't submit before 1 minute, it will automatically be
          submitted whatever you have selected as answers.
        </li>
        <li>You cannot go to any previous question.</li>
        <li>Only one answer is correct.</li>
      </ul>
      <button onClick={startClickHandler}>Start</button>
      <button onClick={logoutClickHandler}>Logout</button>
      <div className="stats">
        <ul>
          <li>User: {username}</li>
          <li>Attempts: {attempts}</li>
          <li>Minimum score: {min || 0}</li>
          <li>Maximum score: {max || 0}</li>
          <li>Average score: {avg || 0}</li>
        </ul>
      </div>
    </div>
  );
};

export default QuizPreview;
