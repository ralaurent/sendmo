import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { DoorOpen } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import './Navigation.css'
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { useNavigate } from "react-router-dom";

function ProfileButton() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false)
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  const login = () => {
    return
  }

  const navigateToDashboard = () => {
    navigate("/dashboard")
  }

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
    navigate("/")
  };

  return (
    <>
      <div className="nav-container">
        {user && window.location.pathname === "/dashboard" ?
        <div className="dashboard-profile clickable" onClick={toggleMenu}>
          {user?.username[0].toUpperCase()}
        </div>
        :
        !user ?
        <OpenModalButton
        onButtonClick={login}
        modalComponent={<LoginFormModal />}
        buttonComponent={<button className="dashboard-button">
        login
        <ArrowRight/>
      </button>}
        />:
        <button onClick={navigateToDashboard} className="dashboard-button">
          dashboard
          <ArrowRight/>
        </button>
        }
      </div>
      {showMenu && (
        <div className={"profile-dropdown"} ref={ulRef}>
          {/* {user ? (
            <>
              <li>{user.username}</li>
              <li>{user.email}</li>
              <li>
                <button onClick={logout}>Log Out</button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )} */}
          {user && <>
              <div>{user.username}</div>
              <div>{user.email}</div>
              <div>
                <button className="log-out" onClick={logout}>Log Out <DoorOpen className="log-out-door"/></button>
              </div>
            </>}
        </div>
      )}
    </>
  );
}

export default ProfileButton;
