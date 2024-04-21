import { useState, useEffect, useCallback } from 'react';
import SongDetails from '../components/SongDetails';
import SongSearch from '../components/SongSearch';
import Player from '../components/Player';
import GuessBoard from '../components/GuessBoard';
import BottomSong from '../components/BottomSong';
import Login from '../components/Login';
import Help from '../components/Help'
import '../component_styles/home.css';
import { ALL_SONGS, RANDOM_SONG } from '../constants';

// Parent Component for the Main Page
const Endless = ({ onLoginSuccess, uid }) => {
  const [song, setSong] = useState(null);
  const [songs, setSongs] = useState(null);
  const [skip, setSkip] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [dummy, setDummy] = useState(0);

  const helpReRender = () => {
    setDummy(dummy + 1);
    setGuesses([])
    setSkip(0)
  }

  const handleWinUI = useCallback((temporary) => {
    console.log(temporary)
    const checkLoad = setInterval(() => {
      // As before, just get all buttons/modals that need to be updated, and update them

      //Show the modal with the win text
      const txt = document.getElementById("win-or-lose");

      if (txt) {
        txt.className = "win";
        txt.innerHTML = "Congratulations!<br/>You win!";

        if (temporary && temporary.length > 0) {
          const guess = temporary.length === 1 ? "guess" : "guesses";
          // Create an h2 element if there have been guesses
          // Make sure there is only one!
          const h3first = document.getElementById("h3element")

          if (h3first) {
            h3first.remove();
          }
          const h3Element = document.createElement("h3");

          // Set the text content of the h2 element
          h3Element.textContent = "You got it in " + temporary.length + " " + guess + "!";
          h3Element.id = "h3element";
          txt.insertAdjacentElement('afterend', h3Element);
        }
        else if (guesses && guesses.length > 0) {
          const guess = guesses.length === 1 ? "guess" : "guesses";
          // Create an h2 element if there have been guesses
          // Make sure there is only one!
          const h3first = document.getElementById("h3element")

          if (h3first) {
            h3first.remove();
          }
          const h3Element = document.createElement("h3");

          // Set the text content of the h2 element
          h3Element.textContent = "You got it in " + guesses.length + " " + guess + "!";
          h3Element.id = "h3element";
          txt.insertAdjacentElement('afterend', h3Element);
        }
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


      if (txt && skipper && giveup) {
        clearInterval(checkLoad); // Stop the interval once the element is found
      }
    }, 100); // Check every 100 milliseconds
    return () => clearInterval(checkLoad);
  }, [guesses]);


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

      const skipper = document.getElementById('skip')
      if (skipper) {
        skipper.disabled = 'true';
      }

      const giveup = document.getElementById('giveup')

      if (giveup) {
        // Disable the buttons for skip and give up if the game is over
        giveup.disabled = 'true';
      }

      // Set the number of skips back to 4
      // This may be a bandaid fix and should be bettered later.
      // setSkip(4);


      if (txt && giveup && skipper) {
        clearInterval(checkLoad); // Stop the interval once the element is found
      }
    }, 100); // Check every 100 milliseconds
    return () => clearInterval(checkLoad);

  }

  // Decodes song names with HTML special characters
  const decodeHTMLEntities = (text) => {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
    return decodedString;
  };


  // GET one random song from the database (to guess)
  useEffect(() => {
    const fetchRand = async () => {
      const response = await fetch(RANDOM_SONG);
      const json = await response.json();

      if (response.ok) {
        setSong(json);
      }
    };

    fetchRand();
  }, [dummy]);


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

  /**
   * Handles an incorrect guess from the user from either
   * An incorrect guess OR clicking give up 
   * @param {An enter click from the user} x 
   */
  const handleIncorrectGuess = (x) => {

    // if Give up was pressed, user lost:
    if (x === 'Give up') {

      // Update the users daily guesses
      let tempGuesses = [];
      if (guesses && guesses.length > 0) {
        tempGuesses = guesses.slice(0);
      }
      tempGuesses.push('red Gave up!');
      setGuesses(tempGuesses);
      setGameOver(true);
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

    // Update the users daily guesses
    let tempGuesses = [];
    if (guesses && guesses.length > 0) {
      tempGuesses = guesses.slice(0);
    }

    // if the user skipped
    if (x === 'Skip') {
      tempGuesses.push('black Skipped');
      setGuesses(tempGuesses);
    }
    // if the user guessed -- determine artist guess
    else {
      if (y === 'y') {
        tempGuesses.push('yellow ' + x);
        setGuesses(tempGuesses);
      }
      else {
        tempGuesses.push('red ' + x);
        setGuesses(tempGuesses);
      }
    }
  }

  /**
   * Handle a correct guess from the player -- win scenario
   * @param {The user's guess} x 
   */
  const handleCorrectGuess = (x) => {

    // Update the users daily guesses
    let tempGuesses = [];
    if (guesses && guesses.length > 0) {
      tempGuesses = guesses.slice(0);
    }
    tempGuesses.push('green ' + x);
    setGuesses(tempGuesses);
    console.log(tempGuesses)
    setGameOver(true);

    handleWinUI(tempGuesses);
  }

  // Controls the skip button (and toggles a loss when needed)
  useEffect(() => {
    console.log(guesses.length)
    // If you're out of skips, disable the skip button
    if (skip >= 4) {
      const skipper = document.getElementById('skip')
      if (skipper) {
        skipper.disabled = 'true';
      }
    }
    // // If you have lost...
    // This is commented out for now bc it caused bugs!
    if (guesses && guesses.length >= 5) {
      setGameOver(true)
      handleLossUI();
    }
  }, [skip, guesses]);

  return (
    <div key={dummy}>
      {/* Login Pop-up */}
      <Login onLoginSuccess={onLoginSuccess} uid={uid} />
      {/* Help Page Pop-up */}
      <Help />
      <div className='main'>
        {/* only load the player when a random song is picked */}
        {song &&
          <Player
            song={song}
            skip_init={skip}
            onSkip={handleIncorrectGuess}
            onSkipSearch={handleIncorrectSearch}
            isLoaded={isLoaded}
            setIsLoaded={setIsLoaded} />}
        {/* only load the search bar and guesses when there are songs & player is loaded */}
        {songs && isLoaded && (
          <>
            {gameOver === false && (<SongSearch
              song={song}
              songs={songs}
              onIncorrectGuess={handleIncorrectGuess}
              onCorrectGuess={handleCorrectGuess}
              onIncorrectSearch={handleIncorrectSearch}
              decodeHTMLEntities={decodeHTMLEntities}
            />)}
            {/* Game over popup */}
            {gameOver === true && (
              <SongDetails
                song={song}
                decodeHTMLEntities={decodeHTMLEntities}
                setGameOver={setGameOver}
                helpReRender={helpReRender}
              />
            )}
            {/* Guess board */}
            <GuessBoard guesses={guesses}/>
            {/* Game over bottom  */}
            <BottomSong
              song={song}
              decodeHTMLEntities={decodeHTMLEntities} />
          </>)}
      </div>
    </div>
  );
};

export default Endless;
