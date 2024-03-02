import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from './components/Home'
import Profile from './components/Profile'
import NavBar from './components/NavBar'
import { ROUTE } from './constants';

function App() {
  const [date, setDate] = useState(new Date().toDateString());
  const [newDate, setNewDate] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Function to generate a unique identifier
  const generateUserID = () => {
    return 'user_' + Math.random().toString(36).substring(2, 15);
  };

  // Function to get or generate user ID
  const getUserID = () => {
    let userID = localStorage.getItem('userID');

    // If the user ID is not found in localStorage, generate a new one
    if (!userID) {
      userID = generateUserID();
      localStorage.setItem('userID', userID);
    }

    return userID;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = getUserID();

        const response = await fetch(ROUTE + '/api/users/userID/' + userID);

        if (response.status === 200) {
          const data = await response.json();
          if (data.email_address !== null) {
            const user = await fetch(ROUTE + '/api/users/email/' + data.email_address);
            const user_resp = await user.json()
            setLoggedInUser(user_resp.email_address, user_resp.username);
          }
        }
        else {
          setLoggedInUser(null);
          // Create a temporary cookie user for the new browser window user
          fetch(ROUTE + '/api/users/userID/post/' + userID, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "userID": userID, "email_address": null  })
          });

          // Post the temp user with username of their cookie ID
          fetch(ROUTE + '/api/users/' + userID, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({"email_address": null,  "username": userID })
          });
          console.log("Signed up successfully!")
          console.log(userID)
        }
      } catch (error) {
        console.error('An error occurred while fetching user data:', error);
      }
    };

    fetchData(); // Call the asynchronous function
  }); // Empty dependency array to run once when the component mounts

  // on load, compare today's date with the date stored in the DB
  useEffect(() => {
    // if the current date is not the same as the stored date
    if (new Date().toDateString() !== date) {
      setDate(new Date().toDateString());
      setNewDate(true);     // maybe pass in a boolean to route, but will need to load for the first time in a day (may have to store the day's song in DB)
    }

  }, [newDate, date]);

  const openLoginModal = (email) => {
    console.log(email)
    document.getElementById('sign-in-modal').style.display = 'block';
    document.getElementById('signUpEmail').value = email;
  }

  const openHelpModal = () => {
    document.getElementById('helpModal').style.display = 'block';
  }

  const handleLoginSuccess = async(email, username) => {
    const userID = getUserID()
    // Update the loggedInUser state
    setLoggedInUser({ email, username });
    await fetch(ROUTE + '/api/users/userID/patch/' + userID, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "userID": userID, "email_address": email  })
    });
  };

  const handleLogout = async() => {
    // Clear the loggedInUser state
    setLoggedInUser(null);

    const uid = getUserID()
    console.log(uid)
    // If the user logs out, remove their cookie user from the collection
    await fetch(ROUTE + '/api/users/userID/del/' + uid, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "userID": uid})
    });

    localStorage.removeItem('userID');
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
