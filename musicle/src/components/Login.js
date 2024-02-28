import { useEffect, useRef, useState } from 'react';
import { ROUTE } from '../constants';
import '../component_styles/login_styles.css';
import { jwtDecode } from "jwt-decode";

// Login button 
const Login = () => {
  const modalRef = useRef(null);
  const signUpEmail = useRef(null);
  const signUpUsername = useRef(null);
  const firstPassword = useRef(null);
  const confirmPassword = useRef(null);
  const route = ROUTE;

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

  async function handleLoginResponse(response) {
    var userToken = jwtDecode(response.credential)
    var email = userToken.email
    try {
      const response = await fetch(route + '/api/users/email/' + email);
      if (response.status === 404) {
        console.log("User does not exist!")
      }
      else {
        // dev
        const resp = await fetch(route + '/api/users/email/' + email);
        console.log(resp.status)
        const respJson = await resp.json();
        console.log(respJson)
      }
    }
    catch (error) {
      console.log(error);
    }
  }


  return (
    <div id="sign-in-modal" ref={modalRef}>
      <div className="sign-in">
        <span className="close" onClick={closeModal}>&times;</span>
        <div id='signInDiv'>
        </div>
      </div>
    </div>
  );
};

export default Login;