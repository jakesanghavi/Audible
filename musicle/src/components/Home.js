import { useState, useEffect } from 'react';
import SongDetails from './SongDetails';
import SongSearch from './SongSearch';
import Player from './Player';
import Guesses from './Guesses';
import BottomSong from './BottomSong';
import Login from './Login';
import '../component_styles/home.css';
import { ALL_SONGS, RANDOM_SONG } from '../constants';

// Parent Component for the Home Page
const Home = () => {
  const [song, setSong] = useState(null);
  const [songs, setSongs] = useState(null);
  const [skip, setSkip] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);


  // GET one random song from the database
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


  // GET all songs from the database
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

  // If the player guesses wrong, update their # skips used accordingly. If they pressed Give up, make them lose
  const handleIncorrectGuess = (x) => {
    // Overset the skips to know you have lost, if the give up button was pressed.
    if (x === 'Give up') {
      // Remove the search bar when they lose
      document.getElementById('allSearch').style.display = 'none';

      // Show the point where they gave up
      const num = (skip + 1) * 2
      const listEl = document.querySelector(".guess-container li:nth-of-type(" + num + ")");
      listEl.innerHTML = 'Gave up!';
      listEl.classList.add('red')
      setSkip(5);
    } else {
      setSkip((prevSkip) => prevSkip + 1);
    }
  };

  // Use to style the guess items on an incorrect search.
  // x is their guess, and y is a color indicating if the got the artist correct (yellow)
  // or incorrect (red)
  const handleIncorrectSearch = (x, y) => {
    // Get the list item that corresponds to how many skips/guesses they have had
    const num = (skip + 1) * 2
    const listEl = document.querySelector(".guess-container li:nth-of-type(" + num + ")");
    if (x === 'Skip') {
      listEl.innerHTML = 'Skipped';
    }
    else {
      listEl.innerHTML = x;
      if (y === 'y') {
        listEl.classList.add('yellow')
      }
      else {
        listEl.classList.add('red')
      }
    }
  };

  // If the player guesses right, they win!
  const handleCorrectGuess = (x) => {
    // Style their guess to green
    const num = (skip + 1) * 2
    const listEl = document.querySelector(".guess-container li:nth-of-type(" + num + ")");
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
      {/* <NavBar/> */}
      {/* Login Pop-up */}
      <Login/>
      <div className='main'>
        {/* only load the player when there are songs */}
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
            />
            <SongDetails song={song} />
            <Guesses />
            <BottomSong song={song} />
          </>)}
      </div>
    </div>
  );
};

export default Home;
