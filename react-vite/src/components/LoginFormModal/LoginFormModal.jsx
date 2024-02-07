import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
      navigate("/dashboard")
    }
  };

  const handleDemo1Submit = async (e) => {
    e.preventDefault();

    await dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: "password",
      })
    );

    closeModal();
    navigate("/dashboard")
  };

  const handleDemo2Submit = async (e) => {
    e.preventDefault();

    await dispatch(
      thunkLogin({
        email: "marnie@aa.io",
        password: "password",
      })
    );

    closeModal();
    navigate("/dashboard")
  };


  return (
    <>
      <h3>Log In</h3>
      <form onSubmit={handleSubmit}>
        <label className="global-split-label">
          Email
        {<span className="errors">{errors.email}</span>}
          <input
            type="text"
            className="global-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="global-split-label">
          Password
        {<span className="errors">{errors.password}</span>}
          <input
            type="password"
            className="global-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <div>
          <button className="global-button" onClick={handleSubmit} type="submit">Log In</button>
          <div className="global-split-button-container">
            <button className="global-button" onClick={handleDemo1Submit} type="submit">Demo User 1</button>
            <button className="global-button" onClick={handleDemo2Submit} type="submit">Demo User 2</button>
          </div>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;
