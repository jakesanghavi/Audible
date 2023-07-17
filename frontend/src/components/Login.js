import { useEffect, useRef, useState } from 'react';
import '../component_styles/login_styles.css';

const Login = () => {
  const modalRef = useRef(null);
  const [isLoginSelected, setIsLoginSelected] = useState(true);
  const loginForm = document.querySelector("div.login");
  const signUpEmail = useRef(null);
  const firstPassword = useRef(null);
  const confirmPassword = useRef(null);

  const signUpSelect = () => {
    setIsLoginSelected(false);
    loginForm.style.marginLeft = "-50%";
  };

  const loginSelect = () => {
    setIsLoginSelected(true);
    loginForm.style.marginLeft = "0%";
  };

  const checkUserExists = async () => {
    const email_address = signUpEmail.current.value;
    const password = firstPassword.current.value;
    const passwordConfirm = confirmPassword.current.value;

    if (password !== passwordConfirm) {
      console.log("Passwords must match!")
      return;
    }

    console.log(email_address);

    //dev
    try {
      const response = await fetch('http://localhost:3008/api/users/' + email_address);
      // const response = await fetch('https://musicle-official.onrender.com/api/songs/random/random');
      if (response.status == 200) {
        console.log("Email Address already in use!")
      }
      else {
        // dev
        fetch('http://localhost:3008/api/users/' + email_address, {
        //fetch('https://musicle-official.onrender.com/api/users' + email_address, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "email_address": email_address, "password": password })
        });
      }
    }
    catch (error) {
      console.log(error);
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
              <div className="field">
                <input type="text" placeholder="Email Address" required />
              </div>
              <div className="field">
                <input type="password" placeholder="Password" required />
              </div>
              <div className="pass-link">
                <a href="/">Forgot password?</a>
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input style={{ width: "100%" }} type="button" value="Login" />
              </div>
            </div>
            <div className="signup">
              <div className="field">
                <input type="text" id="signUpUserName" placeholder="Email Address" required ref={signUpEmail} />
              </div>
              <div className="field">
                <input type="password" id="signUpPassword" placeholder="Password" required ref={firstPassword} />
              </div>
              <div className="field">
                <input type="password" id="signUpPasswordConfirm"
                  placeholder="Confirm password" required ref={confirmPassword} />
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="button" style={{ width: "100%" }} value="Sign Up" onClick={checkUserExists} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
