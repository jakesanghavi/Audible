import { useState, useEffect } from 'react';
import SongDetails from '../components/SongDetails';
import SongSearch from '../components/SongSearch';
import Player from '../components/Player';

const Home = () => {
  const [song, setSong] = useState(null);
  const [songs, setSongs] = useState(null);
  const [skip, setSkip] = useState(0);

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

  const handleIncorrectGuess = () => {
    setSkip((prevSkip) => prevSkip >= 4 ? 4: prevSkip + 1);
    if (skip >= 4) {
        const txt = document.getElementById("win-or-lose");
        txt.className = "lose";
        txt.innerHTML = "You lose. Better luck next time!"
        const modal = document.getElementById("modal");
        modal.style.display = "block";
    }
  };

  const handleCorrectGuess = () => {
    const txt = document.getElementById("win-or-lose");
    txt.className = "win";
    txt.innerHTML = "Congratulations! You win!"
    const modal = document.getElementById("modal");
    modal.style.display = "block";
  }

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
      </div>
    </div>
  );
};

export default Home;
