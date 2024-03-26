import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import Home from './pages/Home'
import DailyMode from './pages/DailyMode'
import Profile from './pages/Profile'
import NavBar from './components/NavBar'
import { ROUTE } from './constants';

function App() {
  const [date, setDate] = useState(new Date().toDateString());
  const [newDate, setNewDate] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userLastDay, setUserLastDay] = useState(null);
  const [userDailyGuesses, setUserDailyGuesses] = useState(null);
  const [userStats, setUserStats] = useState(null);

  // Function to generate a unique identifier
  const generateUserID = () => {
    return 'user_' + Math.random().toString(36).substring(2, 15);
  };

  // Function to get or generate user ID
  const getUserID = useCallback(() => {
    let userID = localStorage.getItem('userID');

    // If the user ID is not found in localStorage, generate a new one
    if (!userID) {
      userID = generateUserID();
      localStorage.setItem('userID', userID);
    }

    return userID;
  }, []);

  // Run this only when the component mounts, or the userID changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // get the userID for th user
        const userID = getUserID();

        // Check if this browser has been used before on the site
        const response = await fetch(ROUTE + '/api/users/userID/' + userID);

        // If the browser has been used before...
        if (response.status === 200) {
          const data = await response.json();
          // Check if the user is registered too. If they are, log them in automatically
          if (data.email_address !== null) {
            const user = await fetch(ROUTE + '/api/users/email/' + data.email_address);
            const user_resp = await user.json()
            setLoggedInUser({email: user_resp.email_address, username: user_resp.username});

            setUserLastDay(user_resp.last_daily);
            setUserDailyGuesses(user_resp.today_guesses);
            setUserStats(user_resp.daily_history);

            // If they are on registered, remove the google OAuth component when site loads
            const element = document.getElementById('signInDiv').firstChild.firstChild
            if (element) {
              element.remove()
            }
          }
        }
        // If the browser has not been used before...
        else {
          setLoggedInUser(null);
          // Create a new cookie user for the new browser window user
          fetch(ROUTE + '/api/users/userID/post/' + userID, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "userID": userID, "email_address": null })
          });

          // Post the cookie user with username of their cookie ID
          fetch(ROUTE + '/api/users/' + userID, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "email_address": null, "username": userID })
          });
        }
      } catch (error) {
        console.error('An error occurred while fetching user data:', error);
      }
    };

    fetchData(); // Call the asynchronous function
  }, [getUserID]); // Empty dependency array to run once when the component mounts

  // on load, compare today's date with the date stored in the DB
  useEffect(() => {
    // if the current date is not the same as the stored date
    if (new Date().toDateString() !== date) {
      setDate(new Date().toDateString());
      setNewDate(true);     // maybe pass in a boolean to route, but will need to load for the first time in a day (may have to store the day's song in DB)
    }

  }, [newDate, date]);

  const openLoginModal = (email) => {
    document.getElementById('sign-in-modal').style.display = 'block';
    document.getElementById('signUpEmail').value = email;
  }

  const openHelpModal = () => {
    document.getElementById('helpModal').style.display = 'block';
  }

  // When they log in, remove the google oAuth component when site loads
  const handleLoginSuccess = async (email, username) => {
    const element = document.getElementById('signInDiv').firstChild.firstChild
    if (element) {
      element.remove()
    }

    const userID = getUserID()
    // Update the loggedInUser state
    await fetch(ROUTE + '/api/users/userID/patch/' + userID, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "userID": userID, "email_address": email })
    });

  };

  const handleLogout = async () => {
    // Clear the loggedInUser state
    setLoggedInUser(null);

    const uid = getUserID()

    // If the user logs out, remove their cookie user from the collection
    await fetch(ROUTE + '/api/users/userID/del/' + uid, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "userID": uid })
    });

    // Remove their userID from localstorage
    localStorage.removeItem('userID');

    // Immediately after logout, make a new temp user for the browser user with a newly generated cookie ID
    const userID = getUserID()

    fetch(ROUTE + '/api/users/userID/post/' + userID, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "userID": userID, "email_address": null })
    });

    // Post the temp user with username of their cookie ID
    fetch(ROUTE + '/api/users/' + userID, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "email_address": null, "username": userID })
    });
  };

  return (
    <div className="App" id="app" style={{ backgroundColor: '#ECE5F0', height: '100vh' }}>
      <BrowserRouter>
        <NavBar openLoginModal={openLoginModal} openHelpModal={openHelpModal} loggedInUser={loggedInUser} onLoginSuccess={handleLoginSuccess} uid={getUserID} />
        <div className='pages'>
          <Routes>
            <Route
              path="/"
              element={<Home isNewDay={newDate} loggedInUser={loggedInUser} onLoginSuccess={handleLoginSuccess} uid={getUserID} />}
            />
            <Route
              path="/dailymode"
              element={<DailyMode isNewDay={newDate} loggedInUser={loggedInUser} onLoginSuccess={handleLoginSuccess} uid={getUserID} userLastDay={userLastDay} userDailyGuesses={userDailyGuesses} userStats={userStats} />}
            />
            <Route
              path='/profile'
              element={<Profile onLogout={handleLogout} />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
