import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const NavBar = (openLoginModal) => {

    const loginModalDummy = () => {
        openLoginModal.openLoginModal();
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

    return (
        <header>
            <div className='container'>
                <div className="hamburger-holder">
                    <input type="checkbox" className="openSidebarMenu" id="openSidebarMenu" onClick={disableButtons}/>
                    <label htmlFor="openSidebarMenu" className="sidebarIconToggle">
                        <FontAwesomeIcon icon={faBars} />
                    </label>
                    <div id="sidebarMenu" style={{zIndex: 1000000}}>
                        <ul className="sidebarMenuInner">
                            <li><a href="/">Daily Mode</a></li>
                            <li>Endless Mode<br/>(Coming Soon!)</li>
                            <li>Race Mode<br/>(Coming Soon!)</li>
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
                <div className="sign-in-text" id="sign-in-text" onClick={loginModalDummy}>
                    <h2>Sign In</h2>
                </div>
            </div>
        </header>
    )
}

export default NavBar