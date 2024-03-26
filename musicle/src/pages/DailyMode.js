import { useState, useEffect } from 'react';
import SongDetails from '../components/SongDetails';
import SongSearch from '../components/SongSearch';
import Player from '../components/Player';
import GuessBoard from '../components/GuessBoard';
import BottomSong from '../components/BottomSong';
import Login from '../components/Login';
import Help from '../components/Help'
import '../component_styles/home.css';
import { ROUTE, ALL_SONGS, DAILY_SONG } from '../constants';

// Parent Component for the Main Page
const DailyMode = ({ loggedInUser, onLoginSuccess, uid, userLastDay, userDailyGuesses, userStats }) => {
  const [dailySong, setDailySong] = useState(null);
  const [songs, setSongs] = useState(null);
  const [skip, setSkip] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [guesses, setGuesses] = useState(userDailyGuesses);
  const [lastDay, setLastDay] = useState(userLastDay);
  const [uStats, setUStats] = useState(userStats);

  const currentDate = new Date().toJSON().slice(0, 10);

  useEffect(() => {
    if (userDailyGuesses) {
      setGuesses(userDailyGuesses);
    }
  }, [userDailyGuesses]);

  useEffect(() => {
    if (guesses && guesses.length > 0) {
      setSkip(guesses.length)
      const final_guess = guesses[guesses.length - 1].split(" ");
      if (final_guess[0] === "green") {
        handleWinUI();
      }
      else if (guesses.length === 5) {
        console.log(guesses.length)
        handleLossUI();
      }
    }

  }, [guesses])

  useEffect(() => {
    if (userLastDay) {
      // Update guesses when userDailyGuesses changes
      setLastDay(userLastDay);
    }
  }, [userLastDay]);

  useEffect(() => {
    // Update guesses when userDailyGuesses changes
    setUStats(userStats);
  }, [userStats]);

  /**
   * Returns the element of the current guess
   */
  const getGuessElement = () => {
    const num = (skip + 1) * 2
    return document.querySelector(".guess-container li:nth-of-type(" + num + ")");
  }

  // Decodes song names with HTML special characters
  const decodeHTMLEntities = (text) => {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
    return decodedString;
  };

  const checkPlayed = () => {
    if (lastDay !== currentDate) {
      if (lastDay) {
        setGuesses([]);
      }
      setLastDay(currentDate)
    }
  }


  // GET the daily song from the database (to guess)
  useEffect(() => {
    const fetchDaily = async () => {
      const response = await fetch(DAILY_SONG);
      const json = await response.json();

      if (response.ok) {
        setDailySong(json);
      }
    };

    fetchDaily();
  }, []);

  // GET all songs from the database (for list)
  useEffect(() => {
    const fetchAll = async () => {
      const response = await fetch(ALL_SONGS);
      const json = await response.json();

      if (response.ok) {
        setSongs(json);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    // Prevent random null POSTs or ones without a user
    if (loggedInUser && lastDay) {
      fetch(ROUTE + '/api/users/patchstats/' + loggedInUser.username, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "username": loggedInUser.username, "lastDaily": lastDay, "todayGuesses": guesses, "userStats": uStats })
      });
    }
  }, [guesses, lastDay, uStats, loggedInUser]);

  const handleWinUI = () => {
    const checkLoad = setInterval(() => {
      const allsearch = document.getElementById('allSearch')

      if (allsearch) {
        allsearch.style.display = 'none';
      }
      

      //Show the modal with the win text
      const txt = document.getElementById("win-or-lose");

      if (txt) {
        txt.className = "win";
        txt.innerHTML = "Congratulations! You win!"
      }

      const modal = document.getElementById("song-details-modal");

      if (modal) {
        modal.style.display = "block";
      }

      const skipper = document.getElementById('skip')
      if (skipper) {
        skipper.disabled = 'true';
      }

      const giveup = document.getElementById('giveup')

      if (giveup) {
        giveup.disabled = 'true';
      }
      // Disable the buttons for skip and give up if the game is over


      if (txt && modal && skipper && giveup && allsearch) {
        clearInterval(checkLoad); // Stop the interval once the element is found
      }
    }, 100); // Check every 100 milliseconds
    return () => clearInterval(checkLoad);
  }

  const handleLossUI = () => {
    // Show the modal with the lose text
    const checkLoad = setInterval(() => {

      //Show the modal with the win text
      const txt = document.getElementById("win-or-lose");
      if (txt) {
        txt.className = "lose";
        txt.innerHTML = "You lose.<br/>Maybe next time!"
      }
      const modal = document.getElementById("song-details-modal");

      if (modal) {
        modal.style.display = "block";
      }

      const giveup = document.getElementById('giveup')

      if (giveup) {
        // Disable the buttons for skip and give up if the game is over
        giveup.disabled = 'true';
      }

      const allsearch = document.getElementById('allSearch')

      if (allsearch) {
        // Hide the search bar
        allsearch.style.display = 'none';
      }

      // Hide the dropdown song list
      if (document.getElementById("song-list-container") !== null) {
        document.getElementById("song-list-container").style.display = 'none';
      }
      // Set the number of skips back to 4
      // This may be a bandaid fix and should be bettered later.
      // setSkip(4);


      if (txt && modal && giveup && allsearch) {
        clearInterval(checkLoad); // Stop the interval once the element is found
      }
    }, 100); // Check every 100 milliseconds
    return () => clearInterval(checkLoad);

  }

  /**
   * Handles an incorrect guess from the user from either
   * An incorrect guess OR clicking give up 
   * @param {An enter click from the user} x 
   */
  const handleIncorrectGuess = (x) => {

    checkPlayed();

    // if Give up was pressed, user lost:
    if (x === 'Give up') {
      // Remove the search bar when they lose
      document.getElementById('allSearch').style.display = 'none';

      // Show the point where they gave up on guess board
      const listEl = getGuessElement();

      if (!listEl) {
        return
      }

      listEl.innerHTML = 'Gave up!';
      listEl.classList.add('red')

      // Update the users daily guesses
      let tempGuesses = [];
      if (guesses && guesses.length === 0) {
        tempGuesses = guesses.slice(0);
      }
      tempGuesses.push('red ' + x);
      setGuesses(tempGuesses);

      // set skip count to 5
      setSkip(5);
    } else {
      // otherwise, increment skip
      setSkip((prevSkip) => prevSkip + 1);
    }
  };

  /**
   * Handles incorrect search by adjusting guess board
   * @param {The user's input} x 
   * @param {The color to indicate whether the artist was correct or not} y 
   */
  const handleIncorrectSearch = (x, y) => {

    checkPlayed();

    // Determine which guess the search corresponds to 
    let listEl = getGuessElement();
    if (!listEl) {
      return;
    }

    // Update the users daily guesses
    let tempGuesses = [];
    if (guesses && guesses.length > 0) {
      tempGuesses = guesses.slice(0);
    }

    // if the user skipped
    if (x === 'Skip') {
      listEl.innerHTML = 'Skipped';
      tempGuesses.push('black Skipped');
      setGuesses(tempGuesses);
    }
    // if the user guessed -- determine artist guess
    else {
      listEl.innerHTML = x;
      if (y === 'y') {
        tempGuesses.push('yellow ' + x);
        setGuesses(tempGuesses);
        listEl.classList.add('yellow')
      }
      else {
        tempGuesses.push('red ' + x);
        setGuesses(tempGuesses);
        listEl.classList.add('red')
      }
    }
  }

  /**
   * Handle a correct guess from the player -- win scenario
   * @param {The user's guess} x 
   */
  const handleCorrectGuess = (x) => {

    checkPlayed();

    // Determine which guess their search corresponds to
    let listEl = getGuessElement();

    if (!listEl) {
      return
    }

    // Make the guess green
    listEl.innerHTML = x;
    listEl.classList.add('green');

    // Update the users daily guesses
    let tempGuesses = [];
    if (guesses && guesses.length > 0) {
      tempGuesses = guesses.slice(0);
    }
    tempGuesses.push('green ' + x);
    setGuesses(tempGuesses);

    handleWinUI();
  }

  // Controls the skip button (and toggles a loss when needed)
  useEffect(() => {
    // If you're out of skips, disable the skip button
    if (skip >= 4) {
      const skipper = document.getElementById('skip')
      if (skipper) {
        skipper.disabled = 'true';
      }
    }
    // If you have lost...
    if (skip >= 5) {
      handleLossUI();
    }
  }, [skip]);

  return (
    <div>
      {/* Login Pop-up */}
      <Login onLoginSuccess={onLoginSuccess} uid={uid} />
      {/* Help Page Pop-up */}
      <Help />
      <div className='main'>
        {/* only load the player when a random song is picked */}
        {dailySong &&
          <Player
            song={dailySong}
            skip_init={skip}
            onSkip={handleIncorrectGuess}
            onSkipSearch={handleIncorrectSearch}
            isLoaded={isLoaded}
            setIsLoaded={setIsLoaded} />}
        {/* only load the search bar and guesses when there are songs & player is loaded */}
        {songs && isLoaded && (
          <>
            <SongSearch
              song={dailySong}
              songs={songs}
              onIncorrectGuess={handleIncorrectGuess}
              onCorrectGuess={handleCorrectGuess}
              onIncorrectSearch={handleIncorrectSearch}
              decodeHTMLEntities={decodeHTMLEntities}
            />
            {/* Game over popup */}
            <SongDetails
              song={dailySong}
              decodeHTMLEntities={decodeHTMLEntities} />
            {/* Guess board */}
            <GuessBoard guesses={guesses} />
            {/* Game over bottom  */}
            <BottomSong
              song={dailySong}
              decodeHTMLEntities={decodeHTMLEntities} />
          </>)}
      </div>
    </div>
  );
};

export default DailyMode;
