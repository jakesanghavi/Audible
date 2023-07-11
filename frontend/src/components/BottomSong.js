import '../component_styles/bottomsong_styles.css';

const BottomSong = ({ song }) => {
    // Some song names have HTML special characters. This decodes them.
    const decodeHTMLEntities = (text) => {
        const parser = new DOMParser();
        const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
        return decodedString;
    };

    return (
        <div className="grid-container" id='bottom-songs'>
            <a target="_blank" rel='noreferrer' href={song.full_link}>
                <div><img src={song.album_cover} alt="album cover" /></div>
            </a>
            <a target="_blank" rel='noreferrer' href={song.full_link}>
                <div className="bottomsong-details">
                    <ul>
                        <li>
                            <h1>
                                <strong>{decodeHTMLEntities(song.song_title)}</strong>
                            </h1>
                        </li>
                        <li>
                            <h3>
                                {decodeHTMLEntities(song.artist)}
                            </h3>
                        </li>
                        <li>
                            {decodeHTMLEntities(song.album_name)}
                        </li>
                    </ul>
                </div>
            </a>
        </div>
    )
};
export default BottomSong;