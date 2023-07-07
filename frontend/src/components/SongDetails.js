import { useEffect, useRef } from 'react';
import '../songDetails_styles.css';

const SongDetails = ({ song }) => {
  const modalRef = useRef(null);

  const decodeHTMLEntities = (text) => {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
    return decodedString;
  };

  const closeModal = () => {
    modalRef.current.style.display = 'none';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && event.target == modalRef.current) {
        closeModal();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div id="modal" ref={modalRef}>
      <div className="song-details">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2 id="win-or-lose" className="win">Congratulations! You win!</h2>
        <h4>{song.song_title}</h4>
        <p><strong>Artist: </strong>{song.artist}</p>
        <p><strong>Album: </strong>{decodeHTMLEntities(song.album_name)}</p>
        <img src={song.album_cover} alt="album cover" />
      </div>
    </div>
  );
};

export default SongDetails;
