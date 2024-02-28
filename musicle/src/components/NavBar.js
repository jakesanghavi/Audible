import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import '../component_styles/navbar_styles.css'
import { ROUTE } from '../constants';
import { useEffect, useRef, useState } from 'react';
import { jwtDecode } from "jwt-decode";

// Other game modes
const NavBar = ({ openLoginModal, openHelpModal }) => {

  const route = ROUTE;

  const loginModal = () => {
    openLoginModal();
  }

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