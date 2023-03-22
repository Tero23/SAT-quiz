import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quiz from "./Quiz";
import Register from "./Register";
import Login from "./Login";
import NotFound from "./NotFound";
import QuizPreview from "./QuizPreview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quizPreview" element={<QuizPreview />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
