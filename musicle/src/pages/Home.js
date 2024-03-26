import { useState, useEffect } from 'react';
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
const Home = ({ loggedInUser, onLoginSuccess, uid }) => {
  const [song, setSong] = useState(null);
  const [songs, setSongs] = useState(null);
  const [skip, setSkip] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

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

  /**
   * Handles an incorrect guess from the user from either
   * An incorrect guess OR clicking give up 
   * @param {An enter click from the user} x 
   */
  const handleIncorrectGuess = (x) => {
    // if Give up was pressed, user lost:
    if (x === 'Give up') {
      // Remove the search bar when they lose
      document.getElementById('allSearch').style.display = 'none';

      // Show the point where they gave up on guess board
      const listEl = getGuessElement();
      listEl.innerHTML = 'Gave up!';
      listEl.classList.add('red')
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
    // Determine which guess the search corresponds to 
    let listEl = getGuessElement();
    // if the user skipped
    if (x === 'Skip') {
      listEl.innerHTML = 'Skipped';
    }
    // if the user guessed -- determine artist guess
    else {
      listEl.innerHTML = x;
      if (y === 'y') {
        listEl.classList.add('yellow')
      }
      else {
        listEl.classList.add('red')
      }
    }
  }

  /**
   * Handle a correct guess from the player -- win scenario
   * @param {The user's guess} x 
   */
  const handleCorrectGuess = (x) => {

    // Determine which guess their search corresponds to
    let listEl = getGuessElement();

    // Make the guess green
    listEl.innerHTML = x;
    listEl.classList.add('green');

    // Hide the search bar
    document.getElementById('allSearch').style.display = 'none';

    //Show the modal with the win text
    const txt = document.getElementById("win-or-lose");
    txt.className = "win";
    txt.innerHTML = "Congratulations! You win!"
    const modal = document.getElementById("song-details-modal");
    modal.style.display = "block";

    // Disable the buttons for skip and give up if the game is over
    document.getElementById('skip').disabled = 'true';
    document.getElementById('giveup').disabled = 'true';
  }

  // Controls the skip button (and toggles a loss when needed)
  useEffect(() => {
    // If you're out of skips, disable the skip button
    if (skip >= 4) {
      document.getElementById('skip').disabled = 'true';
    }
    // If you have lost...
    if (skip >= 5) {
      // Show the modal with the lose text
      const txt = document.getElementById("win-or-lose");
      txt.className = "lose";
      txt.innerHTML = "You lose.<br/>Maybe next time!"
      const modal = document.getElementById("song-details-modal");
      modal.style.display = "block";

      // Disable the buttons for skip and give up if the game is over
      document.getElementById('giveup').disabled = 'true';

      // Hide the search bar
      document.getElementById('allSearch').style.display = 'none';

      // Hide the dropdown song list
      if (document.getElementById("song-list-container") !== null) {
        document.getElementById("song-list-container").style.display = 'none';
      }
      // Set the number of skips back to 4
      // This may be a bandaid fix and should be bettered later.
      // setSkip(4);
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
            <SongSearch
              song={song}
              songs={songs}
              onIncorrectGuess={handleIncorrectGuess}
              onCorrectGuess={handleCorrectGuess}
              onIncorrectSearch={handleIncorrectSearch}
              decodeHTMLEntities={decodeHTMLEntities}
            />
            {/* Game over popup */}
            <SongDetails
              song={song}
              decodeHTMLEntities={decodeHTMLEntities} />
            {/* Guess board */}
            <GuessBoard />
            {/* Game over bottom  */}
            <BottomSong
              song={song}
              decodeHTMLEntities={decodeHTMLEntities} />
          </>)}
      </div>
    </div>
  );
};

export default Home;
