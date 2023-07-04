const SongDetails = ({song}) => {

    const decodeHTMLEntities = (text) => {
        const parser = new DOMParser();
        const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
        return decodedString;
    };

    console.log(decodeHTMLEntities("Me &amp; you"))

    return (
        <div className='song-details'>
            <h4>{song.song_title}</h4>
            <p><strong>Artist: </strong>{song.artist}</p>
            <p><strong>Album: </strong>{decodeHTMLEntities(song.album_name)}</p>
            <img src={song.album_cover} alt="album cover"/>
        </div>
    )
}

export default SongDetails