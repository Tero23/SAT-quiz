import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "./context/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
const LOGIN_URL = "http://localhost:8000/api/v1/users/login";

const Login = () => {
  let navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        { username: user, password: pwd },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response?.data.status === "success") {
        setSuccess(true);
        //console.log(JSON.stringify(response));
        // setAuth({ username: user, password: pwd });
        setUser("");
        setPwd("");
      }
    } catch (err) {
      console.log(err);
      if (err.response?.status === 400) {
        setErrMsg("Invalid username or password!");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        navigate("/quizPreview")
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <button>Sign In</button>
          </form>
          <p>
            Need an Account?
            <br />
            <span className="line">
              <Link to="/register">Register</Link>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Login;
