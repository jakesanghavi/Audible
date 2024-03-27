import { useState, useEffect, useCallback } from 'react';
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

  console.log(userStats)

  // Get the current date in the user's time zone
  const currentDate = new Date().toJSON().slice(0, 10);

  // Call this when the user wins
  // This will also call when a user who also won for the day re-opens the page
  const handleWinUI = useCallback(() => {
    const checkLoad = setInterval(() => {
      // As before, just get all buttons/modals that need to be updated, and update them
      const allsearch = document.getElementById('allSearch')

      if (allsearch) {
        allsearch.style.display = 'none';
      }

      //Show the modal with the win text
      const txt = document.getElementById("win-or-lose");

      if (txt) {
        txt.className = "win";
        txt.innerHTML = "Congratulations! You win!"

        if (guesses && guesses.length > 0) {
          const guess = guesses.length === 1 ? "guess" : "guesses";
          // Create an h2 element if there have been guesses
          // Make sure there is only one!
          const h2first = document.getElementById("h2element")

          if (h2first) {
            h2first.remove();
          }
          const h2Element = document.createElement("h2");

          // Set the text content of the h2 element
          h2Element.textContent = "You got it in " + guesses.length + " " + guess + "!";
          h2Element.id = "h2element";
          txt.insertAdjacentElement('afterend', h2Element);
        }
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
  },[guesses]);


  // Call this when the user loses
  // This will also call when a user who also lost for the day re-opens the page
  const handleLossUI = () => {
    // As before, just get all buttons/modals that need to be updated, and update them
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

      const skipper = document.getElementById('skip')
      if (skipper) {
        skipper.disabled = 'true';
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


      if (txt && modal && giveup && allsearch && skipper) {
        clearInterval(checkLoad); // Stop the interval once the element is found
      }
    }, 100); // Check every 100 milliseconds
    return () => clearInterval(checkLoad);

  }

  // Update the user's daily guesses once passed
  useEffect(() => {
    if (userDailyGuesses && userDailyGuesses.length > 0) {
      setGuesses(userDailyGuesses);
    }
  }, [userDailyGuesses]);

  // Update the user's used skips guesses once their guesses are passed
  useEffect(() => {
    if (guesses && guesses.length > 0) {
      setSkip(guesses.length)

      // Check whether they have already won or lost based on their guesses
      // If so, call the respective win/loss UI helpers
      const final_guess = guesses[guesses.length - 1];
      const firstSpaceIndex = final_guess.indexOf(" ");
      const guessClass = firstSpaceIndex !== -1 ? final_guess.substring(0, firstSpaceIndex) : "";
          // The content/title is after the first space
      const guessContent = firstSpaceIndex !== -1 ? final_guess.substring(firstSpaceIndex + 1) : final_guess;
      if (guessClass === "green") {
        let tempStats = [];
        if (userStats) {
          tempStats = userStats.slice(0);
        }
        tempStats.push(guesses.length)
        setUStats(tempStats)
        handleWinUI();
      }
      else if (guessContent === "Gave up!" || guesses.length === 5) {
        let tempStats = [];
        if (userStats) {
          tempStats = userStats.slice(0);
        }
        tempStats.push(null)
        setUStats(tempStats)
        handleLossUI();
      }
    }

  }, [guesses, handleWinUI, userStats])

  // Update the user's last day played once passed
  // If they haven't played today, clear their guesses
  // useEffect(() => {
  //   if (userLastDay) {
  //     setLastDay(userLastDay);
  //     if (userLastDay !== currentDate) {
  //       setGuesses([])
  //     }
  //   }
  // }, [userLastDay, currentDate]);

  // Update the user's stats once passed
  useEffect(() => {
    if (userStats) {
      setUStats(userStats);
    }
    else {
      setUStats([]);
    }
  }, [userStats]);

  /**
   * Returns the element of the current guess
   */
  // const getGuessElement = () => {
  //   const num = (skip + 1) * 2
  //   return document.querySelector(".guess-container li:nth-of-type(" + num + ")");
  // }

  // Decodes song names with HTML special characters
  const decodeHTMLEntities = (text) => {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
    return decodedString;
  };

  // Check if the user has played today. If not, set last played date to today
  const checkPlayed = () => {
    if (lastDay !== currentDate) {
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

  // POST the user's new data whenever it changes
  useEffect(() => {
    // Prevent random null POSTs or ones without a user
    // Also, no need to update stats if they are empty. This constraint fixes bugs
    if (loggedInUser && lastDay && guesses && uStats) {
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
      // document.getElementById('allSearch').style.display = 'none';

      // Show the point where they gave up on guess board
      // const listEl = getGuessElement();

      // if (!listEl) {
      //   return
      // }

      // listEl.innerHTML = 'Gave up!';
      // listEl.classList.add('red')

      // Update the users daily guesses
      let tempGuesses = [];
      if (guesses && guesses.length > 0) {
        tempGuesses = guesses.slice(0);
      }
      tempGuesses.push('red Gave up!');
      setGuesses(tempGuesses);

      handleLossUI();

      // set skip count to 5
      // setSkip(5);
    } else {
      // otherwise, increment skip
      setSkip(skip + 1);
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
    // let listEl = getGuessElement();
    // if (!listEl) {
    //   return;
    // }

    // Update the users daily guesses
    let tempGuesses = [];
    if (guesses && guesses.length > 0) {
      tempGuesses = guesses.slice(0);
    }

    // if the user skipped
    if (x === 'Skip') {
      // listEl.innerHTML = 'Skipped';
      tempGuesses.push('black Skipped');
      setGuesses(tempGuesses);
    }
    // if the user guessed -- determine artist guess
    else {
      // listEl.innerHTML = x;
      if (y === 'y') {
        tempGuesses.push('yellow ' + x);
        setGuesses(tempGuesses);
        // listEl.classList.add('yellow')
      }
      else {
        tempGuesses.push('red ' + x);
        setGuesses(tempGuesses);
        // listEl.classList.add('red')
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
    // let listEl = getGuessElement();

    // if (!listEl) {
    //   return
    // }

    // Make the guess green
    // listEl.innerHTML = x;
    // listEl.classList.add('green');

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
    // // If you have lost...
    // This is commented out for now bc it caused bugs!
    // if (guesses && guesses.length >= 5) {
    //   handleLossUI();
    // }
  }, [skip, guesses]);

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
