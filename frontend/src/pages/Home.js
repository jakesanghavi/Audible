import { useState, useEffect } from 'react';
import SongDetails from '../components/SongDetails';
import SongSearch from '../components/SongSearch';
import Player from '../components/Player';
import Guesses from '../components/Guesses';

const Home = () => {
  const [song, setSong] = useState(null);
  const [songs, setSongs] = useState(null);
  const [skip, setSkip] = useState(0);

  // GET one random song from the database
  useEffect(() => {
    const fetchRand = async () => {
      const response = await fetch('http://localhost:4000/api/songs/random/random');
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
      const response = await fetch('http://localhost:4000/api/songs/');
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
      setSkip(5);
    } else {
      setSkip((prevSkip) => prevSkip + 1);
    }
  };

  // If the player guesses right, they win!
  const handleCorrectGuess = () => {
    //Show the modal with the win text
    const txt = document.getElementById("win-or-lose");
    txt.className = "win";
    txt.innerHTML = "Congratulations! You win!"
    const modal = document.getElementById("modal");
    modal.style.display = "block";
  }

  useEffect(() => {
    // If you have lost...
    if (skip >= 5) {
      // Show the modal with the lose text
      const txt = document.getElementById("win-or-lose");
      txt.className = "lose";
      txt.innerHTML = "You lose. Better luck next time!"
      const modal = document.getElementById("modal");
      modal.style.display = "block";

      // Disable the search bar and make it display 'Game Over!'
      document.getElementById("searchBar").disabled = true;
      document.getElementById("searchBar").value='Game Over!';

      // Hide the dropdown song list
      if (document.getElementById("song-list-container") !== null) {
        document.getElementById("song-list-container").style.display='none';
      }
      // Set the number of skips back to 4
      // This may be a bandaid fix and should be bettered later.
      // setSkip(4);
    }
  }, [skip]);

  return (
    <div className='Home'>
      <div className='songs'>
      {song && <Player song={song} skip_init={skip} onSkip={handleIncorrectGuess}/>}
        {songs && (
          <SongSearch
            song={song}
            songs={songs}
            onIncorrectGuess={handleIncorrectGuess}
            onCorrectGuess={handleCorrectGuess}
          />
        )}
        {songs && <SongDetails song={song} />}
        <Guesses/>
      </div>
    </div>
  );
};

export default Home;
