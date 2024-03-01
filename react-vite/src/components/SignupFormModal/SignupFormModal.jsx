import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import { useNavigate } from "react-router-dom";
import { validate as emailValidator } from 'react-email-validator'
import "./SignupForm.css";

function SignupFormModal() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!emailValidator(email)){
      return setErrors({
        email:
        "Invalid Email!"
      })
    } 
    if(username.length < 5){
      return setErrors({
        username:
        "Username must be at least 5 characters long!"
      })
    }
    if(password.length < 8){
      return setErrors({
        password:
          "Password must be at least 8 characters long!",
      });
    }
    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Passwords must match!",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
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

  useEffect(() => {
    let errors = {}
    if(email.length >= 40){
      errors.email = "Email can't be longer than 40 characters!"
      
    }
    if(username.length >= 20){
      errors.username = "Username can't be longer than 20 characters!"
      
    }
    if(password.length >= 50){
      errors.password = "Password can't be longer than 50 characters!"
    }

    setErrors(errors)
  }, [username, password])

  return (
    <>
      <h3>Sign Up {<span className="errors">{errors.server}</span>}</h3>
      <form onSubmit={handleSubmit}>
        <label className="global-split-label">
          Email
          {<span className="errors">{errors.email}</span>}
          <input
            type="text"
            value={email}
            className="global-input"
            onChange={(e) => setEmail(e.target.value)}
            maxLength={40}
            required
          />
        </label>
        <label  className="global-split-label">
          Username
          {<span className="errors">{errors.username}</span>}
          <input
            type="text"
            className="global-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
            required
          />
        </label>
        <label  className="global-split-label">
          Password
          {<span className="errors">{errors.password}</span>}
          <input
            type="password"
            className="global-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={50}
            required
          />
        </label>
        <label  className="global-split-label">
          Confirm Password
          {<span className="errors">{errors.confirmPassword}</span>}
          <input
            type="password"
            className="global-input"
            value={confirmPassword}
            maxLength={50}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button className="global-button" type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
