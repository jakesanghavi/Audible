import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import '../component_styles/navbar_styles.css'
import { ROUTE } from '../constants';
import { useEffect, useCallback } from 'react';
import { jwtDecode } from "jwt-decode";

// Other game modes
const NavBar = ({ openLoginModal, openHelpModal }) => {

  const route = ROUTE;

  const loginModal = useCallback(email => {
    openLoginModal(email);
  }, [openLoginModal]);

  const helpModal = () => {
    openHelpModal();
  }

  const disableButtons = () => {
    const buttons = document.getElementById('player-controls');
    if (buttons.style.pointerEvents === 'none') {
      buttons.style.pointerEvents = 'auto';
    }
    else {
      buttons.style.pointerEvents = 'none';
    }
  }

  const handleLoginResponse = useCallback(async (response) => {
    try {
      var userToken = jwtDecode(response.credential);
      var email = userToken.email;

      const userCheckResponse = await fetch(route + '/api/users/email/' + email);

      if (userCheckResponse.status !== 200) {
        console.log("User does not exist!");
        loginModal(email);
      } else {
        const userDataResponse = await fetch(route + '/api/users/email/' + email);
        const respJson = await userDataResponse.json();
        console.log(respJson);
        // Additional code for handling existing user data if needed
      }
    } catch (error) {
    }
  }, [loginModal, route]);

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
  }, [handleLoginResponse]);

  return (
    <header>
      <div className='container'>
        <div className="hamburger-holder">
          <input type="checkbox" className="openSidebarMenu" id="openSidebarMenu" onClick={disableButtons} />
          <label htmlFor="openSidebarMenu" className="sidebarIconToggle">
            <FontAwesomeIcon icon={faBars} />
          </label>
          <div id="sidebarMenu" style={{ zIndex: 1000000 }}>
            <ul className="sidebarMenuInner">
              <li><a href="/">Daily Mode</a></li>
              <li>Endless Mode<br />(Coming Soon!)</li>
              <li>Race Mode<br />(Coming Soon!)</li>
            </ul>
          </div>
        </div>
        <div className="home-name-holder">
          <Link to="/">
            <h1>
              Musicle
            </h1>
          </Link>
        </div>
        <div className="blank-space">
        </div>

        <div id="help-button" className="headerText" onClick={helpModal}>
          <h2><FontAwesomeIcon icon={faQuestionCircle} /></h2>
        </div>
        <div id='signInDiv'>
        </div>
      </div>
    </header>
  )
}

export default NavBar