import {Link} from 'react-router-dom'

const NavBar = () => {
    return (
        <header>
            <div className='container'>
                <div className="hamburger-holder">
                    <input type="checkbox" className="openSidebarMenu" id="openSidebarMenu"/>
                    <label htmlFor="openSidebarMenu" className="sidebarIconToggle">
                        <div className="spinner diagonal part-1"></div>
                        <div className="spinner horizontal"></div>
                        <div className="spinner diagonal part-2"></div>
                    </label>
                    <div id="sidebarMenu">
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
            </div>
        </header>
    )
}

export default NavBar