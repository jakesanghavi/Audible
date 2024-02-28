import { useEffect, useRef, useState } from 'react';
import { ROUTE } from '../constants';
import '../component_styles/login_styles.css';
import { jwtDecode } from "jwt-decode";

// Login button 
const Login = () => {
  const modalRef = useRef(null);
  const [isLoginSelected, setIsLoginSelected] = useState(true);
  const loginForm = document.querySelector("div.login");
  const signUpEmail = useRef(null);
  const signUpUsername = useRef(null);
  const firstPassword = useRef(null);
  const confirmPassword = useRef(null);
  const loginUsername = useRef(null);
  const loginPassword = useRef(null);
  const route = ROUTE;

  const signUpSelect = () => {
    setIsLoginSelected(false);
    loginForm.style.marginLeft = "-50%";
  };

  const loginSelect = () => {
    setIsLoginSelected(true);
    loginForm.style.marginLeft = "0%";
  };

  const checkLogin = async () => {
    const username = loginUsername.current.value;
    const password = loginPassword.current.value;

    if (username === '' || !username || password === '' || !password) {
      if (username === '' || !username) {
        console.log("Please input your email address.")
      }
      if (password === '' || !password) {
        console.log("Please input your password.")
      }
      return;
    }

    try {
      const response = await fetch(route + '/api/users/username/' + username);
      if (response.status === 399) {
        console.log("User does not exist!")
      }
      else {
        // dev
        const resp = await fetch(route + '/api/users/username/' + username);
        const respJson = await resp.json();
        if (respJson.password !== password) {
          console.log("Password is incorrect.")
        }
        else {
          console.log("Logged in!")
          closeModal();
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  const checkSignup = async () => {
    const email_address = signUpEmail.current.value;
    const username = signUpUsername.current.value;
    const password = firstPassword.current.value;
    const passwordConfirm = confirmPassword.current.value;

    const emailRegex = /^[a-zA-Z0-9!#$%&*+\-/=?^_{|}~]+@[a-zA-Z0-9!#$%&*+\-/=?^_{|}~]+\.[a-zA-Z0-9!#$%&*+\-/=?^_{|}~]{2,}$/;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (email_address === '' || !email_address || password === '' || !password || passwordConfirm === '' ||
      !passwordConfirm || username === '' || !username || !emailRegex.test(email_address) || !usernameRegex.test(username)) {
      if (email_address === '' | !email_address) {
        console.log("Please input your email address.")
      }
      if (username === '' || !username) {
        console.log("Please input your username.")
      }
      if (password === '' || !password) {
        console.log("Please input your password.")
      }
      if (passwordConfirm === '' || !passwordConfirm) {
        console.log("Please confirm password.")
      }
      if (!emailRegex.test(email_address)) {
        console.log("Please input a valid email address.")
      }
      if (!usernameRegex.test(username)) {
        console.log("Username may only include letters and numbers.")
      }
      return;
    }


    try {
      const response = await fetch(route + '/api/users/email/' + email_address);
      if (response.status === 200) {
        console.log("Email Address already in use!")
        return;
      }

      const response2 = await fetch(route + '/api/users/username/' + username);
      if (response2.status === 200) {
        console.log("Username already in use!")
        return;
      }

      else {
        if (password !== passwordConfirm) {
          console.log("Passwords must match!")
          return;
        }

        if (password.length < 8) {
          console.log("Password must contain at least 8 characters!")
          return;
        }

        const passwordRegex = /^[a-zA-Z0-9!#$^*]+$/;
        if (!passwordRegex.test(password)) {
          console.log("Password can only contain letters, numbers, !, #, $, ^, and *.")
          return;
        }
        // dev
        fetch(route + '/api/users/' + email_address, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "email_address": email_address, "username": username, password: password })
        });
        console.log("Signed up successfully!")
        closeModal();
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  const showLoginPassword = () => {
    if (loginPassword.current.type === "password") {
      loginPassword.current.type = "text";
    } else {
      loginPassword.current.type = "password";
    }
  }

  const showSignUpPassword = () => {
    if (firstPassword.current.type === "password") {
      firstPassword.current.type = "text";
    } else {
      firstPassword.current.type = "password";
    }
    if (confirmPassword.current.type === "password") {
      confirmPassword.current.type = "text";
    } else {
      confirmPassword.current.type = "password";
    }
  }

  const closeModal = () => {
    modalRef.current.style.display = 'none';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && event.target === modalRef.current) {
        closeModal();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
        client_id: "294943120027-n845en83pcg77mf00c2nm2ce44t8ra10.apps.googleusercontent.com",
        callback: handleLoginResponse
    });

    google.accounts.id.renderButton(
        document.getElementById('signInDiv'),
        { theme: 'outline', size: 'large', ux_mode: 'popup'}
    )
  }, []);

  function handleLoginResponse(response) {
    var userToken = jwtDecode(response.credential)
    console.log(userToken)
  }


  return (
    <div id="sign-in-modal" ref={modalRef}>
      <div className="sign-in">
        <span className="close" onClick={closeModal}>&times;</span>
        <div className="form-container">
          <div className="slide-controls">
            <input type="radio" name="slide" id="login" defaultChecked={isLoginSelected} />
            <input type="radio" name="slide" id="signup" defaultChecked={!isLoginSelected} />
            <label htmlFor="login" className="slide login" onClick={loginSelect}>Login</label>
            <label htmlFor="signup" className="slide signup" onClick={signUpSelect}>Sign Up</label>
            <div className="slider-tab"></div>
          </div>
          <div className="form-inner">
            <div className="login">
              <div className="welcome">
                <span>
                  Welcome back to Musicle!
                </span>
              </div>
              <div className="field">
                <input type="text" id="loginEmail" placeholder="Username" required ref={loginUsername} />
              </div>
              <div className="field">
                <input type="password" id="loginPassword" placeholder="Password" required ref={loginPassword} />
              </div>
              <div className="showPassword">
                <input type="checkbox" onClick={showLoginPassword} /> Show password
              </div>
              <div className="pass-link">
                <a href="/">Forgot username/password?</a>
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input style={{ width: "100%" }} type="button" value="Login" onClick={checkLogin} />
              </div>
            </div>
            <div className="signup">
              <div className="field">
                <input type="text" id="signUpEmail" placeholder="Email Address" required ref={signUpEmail} />
              </div>
              <div className="field">
                <input type="text" id="signUpUsername" placeholder="Username" required ref={signUpUsername} />
              </div>
              <div className="field">
                <input type="password" id="signUpPassword" placeholder="Password" required ref={firstPassword} />
              </div>
              <div className="field">
                <input type="password" id="signUpPasswordConfirm"
                  placeholder="Confirm password" required ref={confirmPassword} />
              </div>
              <div className="showPassword">
                <input type="checkbox" onClick={showSignUpPassword} /> Show password
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="button" style={{ width: "100%" }} value="Sign Up" onClick={checkSignup} />
              </div>
            </div>
          </div>
        </div>
        <div id='signInDiv'>
        </div>
      </div>
    </div>
  );
};

export default Login;