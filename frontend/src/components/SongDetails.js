import { useEffect } from 'react';
import '../songDetails_styles.css';

const SongDetails = ({song}) => {

    const decodeHTMLEntities = (text) => {
        const parser = new DOMParser();
        const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
        return decodedString;
    };

    const closeModal = () => {
        document.getElementById('modal').style.display = "none";
    }

    // useEffect(() => {
    //     const handleOutsideClick = (event) => {
    //       const modal = document.getElementById('modal');
    //       if (modal && !modal.contains(event.target)) {
    //         closeModal();
    //       }
    //     };
    
    //     document.addEventListener('click', handleOutsideClick);
    
    //     return () => {
    //       document.removeEventListener('click', handleOutsideClick);
    //     };
    //   }, []);

    return (
        <div id="modal">
            <div className='song-details'>
                <span className="close" onClick={closeModal}>&times;</span>
                <h2 id="win-or-lose" className="win">Congratulations! You win!</h2>
                <h4>{song.song_title}</h4>
                <p><strong>Artist: </strong>{song.artist}</p>
                <p><strong>Album: </strong>{decodeHTMLEntities(song.album_name)}</p>
                <img src={song.album_cover} alt="album cover"/>
            </div>
        </div>
    )
}

export default SongDetails