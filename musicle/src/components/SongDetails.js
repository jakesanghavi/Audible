import { useEffect, useRef } from 'react';
import '../component_styles/songDetails_styles.css';

// Pop-up with song info (game over)
const SongDetails = ({ song, decodeHTMLEntities }) => {
  const modalRef = useRef(null);

  // // Some song names have HTML special characters. This decodes them.
  // const decodeHTMLEntities = (text) => {
  //   const parser = new DOMParser();
  //   const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
  //   return decodedString;
  // };

  // Closes the modal.
  const closeModal = () => {
    // If there was some text saying how many guesses it took the user, delete it
    const h2element = document.getElementById("h2element");
    if (h2element) {
      h2element.remove()
    }
    modalRef.current.style.display = 'none';
    //Show the song details below after closing the modal
    document.getElementById('bottom-songs').style.display = 'flex';
  };

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
  }, []);


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
      </div>
    </div>
  );
};

export default SongDetails;
