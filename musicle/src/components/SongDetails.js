import { useEffect, useRef, useState, useCallback } from 'react';
import '../component_styles/songDetails_styles.css';
import { ROUTE } from '../constants';

// Pop-up with song info (game over)
const SongDetails = ({ song, decodeHTMLEntities, setGameOver, loggedInUser, dailySong, helpReRender }) => {
  const modalRef = useRef(null);
  const [songSolveRate, setSongSolveRate] = useState(null);
  const [userSolveRate, setUserSolveRate] = useState(null);
  const [songAvg, setSongAvg] = useState(null);
  const [userAvg, setUserAvg] = useState(null);

  // // Some song names have HTML special characters. This decodes them.
  // const decodeHTMLEntities = (text) => {
  //   const parser = new DOMParser();
  //   const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
  //   return decodedString;
  // };

  const localReRender = () => {
    closeModal();
    helpReRender();
  }

  // Closes the modal.
  const closeModal = useCallback(() => {
    // If there was some text saying how many guesses it took the user, delete it
    const h2element = document.getElementById("h2element");
    if (h2element) {
      h2element.remove()
    }

    // Show the song details below after closing the modal
    document.getElementById('bottom-songs').style.display = 'flex';
    setGameOver(false);
  }, [setGameOver]);

  const averageAndRateWithoutNulls = (array) => {
    if (!array || array.length === 0) {
      return { average: 0, count: "0%" };
    }
    // Filter out null values
    const filteredArray = array.filter(value => value !== null);

    // Calculate the count of non-null entries
    const count = filteredArray.length;

    // Check if there are non-null values in the array
    if (count === 0) {
        return { average: 0, count: "0%" }; // Handle case where all values are null
    }

    // Calculate the sum of the remaining values
    const sum = filteredArray.reduce((acc, currentValue) => acc + currentValue, 0);

    // Calculate the average
    const average = (sum / count).toFixed(2);
    const solve_rate = (count/array.length).toFixed(2) * 100 + "%";

    return { average, solve_rate };
  }


  // Closes the modal if the user clicks outside of it
  useEffect(() => {
    // If the user clicks outside of the modal when it is up, close it.
    const handleClickOutside = (event) => {
      if (modalRef.current && event.target === modalRef.current) {
        closeModal();
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Remove up the event listener when it's not needed.
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setGameOver, closeModal]);

  useEffect(() => {
    if (loggedInUser) {
      const fetchUserStats = async () => {
        const response = await fetch(ROUTE + '/api/users/username/' + loggedInUser.username);
        const json = await response.json();
    
        if (response.ok) {
          const user_data = averageAndRateWithoutNulls(json.daily_history)
          setUserSolveRate(user_data.solve_rate);
          setUserAvg(user_data.average)
        }
      };
      fetchUserStats()
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (dailySong) {
      const song_data = averageAndRateWithoutNulls(dailySong.user_guesses)
      setSongSolveRate(song_data.solve_rate);
      setSongAvg(song_data.average)
    }
  }, [dailySong]);


  return (
    <div id="song-details-modal" ref={modalRef}>
      <div className="song-details">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2 id="win-or-lose" className="win">Congratulations!<br/>You win!</h2>
        <a id="full-song" target="_blank" rel='noreferrer' href={song.full_link}>
          <h4>{decodeHTMLEntities(song.song_title)}</h4>
          {/* <img src={song.album_cover} alt="album cover" /> */}
        </a>
        <iframe
          width="100%"
          height="200"
          id="iFrame2"
          title="player"
          allow="autoplay"
          visual="true"
          show_artwork="true"
          src={song.soundcloud_link.replace(/visual=false/, "visual=true")}
          loading='eager'
          style={{width: "100%"}}
        />
        <a id="full-song" target="_blank" rel='noreferrer' href={song.full_link}>
          <p><strong>Artist: </strong>{decodeHTMLEntities(song.artist)}</p>
          <p><strong>Album: </strong>{decodeHTMLEntities(song.album_name)}</p>
          {/* <img src={song.album_cover} alt="album cover" /> */}
        </a>
        {/* Conditionally render song/user stats if they exist */}
        <div>
          {/* {(userAvg || userSolveRate || songAvg || songSolveRate) && <br></br>} */}
          <br></br>
          {(!(userAvg || userSolveRate || songAvg || songSolveRate)) && <button onClick={localReRender}>Play Again</button>}
          {userAvg && <p><strong>Your Average Guesses: </strong> {userAvg}</p>}
          {userSolveRate && <p><strong>Your Solve Rate: </strong> {userSolveRate}</p>}
          {songAvg && <p><strong>Global Average Guesses: </strong> {songAvg}</p>}
          {songSolveRate && <p><strong>Global Solve Rate: </strong> {songSolveRate}</p>}
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
