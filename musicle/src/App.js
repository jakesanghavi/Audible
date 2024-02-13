import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from './components/Home'
import NavBar from './components/NavBar'

function App() {
  const [date, setDate] = useState(new Date().toDateString());
  const [newDate, setNewDate] = useState(true);

  // on load, compare today's date with the date stored in the DB
  useEffect(() => {
    // if the current date is not the same as the stored date
    if (new Date().toDateString() !== date) {
      setDate(new Date().toDateString());
      setNewDate(true);     // maybe pass in a boolean to route, but will need to load for the first time in a day (may have to store the day's song in DB)
    }

  }, [newDate, date]);

  const openLoginModal = () => {
    document.getElementById('sign-in-modal').style.display = 'block';
  }

  const openHelpModal = () => {
    console.log("?")
    document.getElementById('helpModal').style.display = 'block';
  }

  return (
    <div className="App" style={{ backgroundColor: '#ECE5F0', height: '100vh' }}>
      <BrowserRouter>
        <NavBar openLoginModal={openLoginModal} openHelpModal={openHelpModal} />
        <div className='pages'>
          <Routes>
            <Route
              path="/"
              element={<Home isNewDay={newDate} />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
