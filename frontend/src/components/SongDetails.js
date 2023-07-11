import { useEffect, useRef } from 'react';
import '../component_styles/songDetails_styles.css';

const SongDetails = ({ song }) => {
  const modalRef = useRef(null);

  // Some song names have HTML special characters. This decodes them.
  const decodeHTMLEntities = (text) => {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
    return decodedString;
  };


  // Closes the modal.
  const closeModal = () => {
    modalRef.current.style.display = 'none';
  };

  useEffect(() => {
    // If the user clicks outside of the modal when it is up, close it.
    const handleClickOutside = (event) => {
      if (modalRef.current && event.target === modalRef.current) {
        closeModal();
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener when it's not needed.
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div id="modal" ref={modalRef}>
      <div className="song-details">
          <span className="close" onClick={closeModal}>&times;</span>
          <h2 id="win-or-lose" className="win">Congratulations! You win!</h2>
        <a id="full-song" target="_blank" rel='noreferrer' href={song.full_link}>
          <h4>{song.song_title}</h4>
          <p><strong>Artist: </strong>{decodeHTMLEntities(song.artist)}</p>
          <p><strong>Album: </strong>{decodeHTMLEntities(song.album_name)}</p>
          <img src={song.album_cover} alt="album cover" />
        </a>
      </div>
    </div>
  );
};

export default SongDetails;
