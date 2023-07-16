import { useEffect, useRef } from 'react';
import '../component_styles/login_styles.css';

const Login = () => {
  const modalRef = useRef(null);


  // Closes the modal.
  const closeModal = () => {
    modalRef.current.style.display = 'none';
  };

  useEffect(() => {
    // If the user clicks outside of the modal when it is up, close it.
    const handleClickOutside = (event) => {
      if (modalRef.current && event.target === modalRef.current) {
        closeModal();
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener when it's not needed.
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div id="sign-in-modal" ref={modalRef}>
      <div className="sign-in">
        <span className="close" onClick={closeModal}>&times;</span>
        <div className='sign-in-details'>
          <h1>Sign in</h1>
          <label htmlFor="username">Username</label>
          <input type='text' id='username'></input>
          <label htmlFor="password">Password</label>
          <input type='text' id='password'></input>
          <h5>Forgot Pasword?</h5>
          <h4>Sign up</h4>
        </div>
      </div>
    </div>
  );
};

export default Login;
