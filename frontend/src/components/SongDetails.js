const SongDetails = ({song}) => {
    return (
        <div className='song-details'>
            <h4>{song.title}</h4>
            <p><strong>Artist: </strong>{song.artist}</p>
            <p><strong>Album: </strong>{song.album}</p>
        </div>
    )
}

export default SongDetails