import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../css/login.css";

class LoginPageSequence {
  static LOGIN = new LoginPageSequence("login");
  static SIGNUP = new LoginPageSequence("signup");

  constructor(type) {
    this.type = type;
  }

  getType() {
    return this.type;
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation(); // added
  const { login, signup, loginWithGoogle } = useAuth();

  const [currPage, setCurrPage] = useState(LoginPageSequence.LOGIN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const switchPage = () => {
    setCurrPage(
      currPage === LoginPageSequence.LOGIN
        ? LoginPageSequence.SIGNUP
        : LoginPageSequence.LOGIN
    );
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      if (currPage === LoginPageSequence.LOGIN) {
        await login(email, password);
      } else {
        await signup(email, password);
      }

      const from = location.state?.from || "/home"; // added
      navigate(from, { replace: true }); // modified

    } catch (err) {
      console.error("Auth error:", err.message);
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      const result = await loginWithGoogle();
      const isNewUser = result._tokenResponse?.isNewUser;
      if (isNewUser) {
        navigate("/profile-setup");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("Google login error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="container-fluid py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card login-card">
              <div className="card-body p-5 text-center">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                  className="login-logo"
                  alt="logo"
                />
                <h3 className="mt-1 mb-2 pb-1">Community Talks</h3>
                <h5 className="mt-1 mb-4 pb-1">
                  Getting Involved in Evanston's Community
                </h5>

                <h4 className="mb-3">
                  {currPage === LoginPageSequence.LOGIN ? "Sign In" : "Sign Up"}
                </h4>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  {currPage === LoginPageSequence.SIGNUP && (
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="First name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-outline mb-3">
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
                    {currPage === LoginPageSequence.LOGIN ? "Login" : "Sign Up"}
                  </button>
                </form>

                <button
                  type="button"
                  className="btn btn-lg w-100 google-button"
                  onClick={handleGoogle}
                >
                  <i className="fab fa-google me-2" />
                  {currPage === LoginPageSequence.LOGIN
                    ? "Sign In with Google"
                    : "Sign Up with Google"}
                </button>

                <p className="mt-3">
                  {currPage === LoginPageSequence.LOGIN
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <span className="switch-link" onClick={switchPage}>
                    {currPage === LoginPageSequence.LOGIN ? "Sign up" : "Login"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
