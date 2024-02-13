import '../component_styles/bottomsong_styles.css';

// Song at bottom (game over)
const BottomSong = ({ song, decodeHTMLEntities }) => {
  return (
    <div className="grid-container" id='bottom-songs'>
      <a target="_blank" rel='noreferrer' href={song.full_link} id="albumCoverLink">
        <div><img src={song.album_cover} alt="album cover" id="albumArt" /></div>
      </a>
      <a target="_blank" rel='noreferrer' href={song.full_link}>
        <div className="bottom-songs-details">
          <h1 id="bottomSong-title">
            {decodeHTMLEntities(song.song_title)}
          </h1>
          <div>
            <h3>
              {decodeHTMLEntities(song.artist)}
            </h3>
            {decodeHTMLEntities(song.album_name)}
          </div>
        </div>
      </a>
    </div>
  )
};
export default BottomSong;