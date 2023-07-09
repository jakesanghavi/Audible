import { useState } from 'react';
import '../songsearch_styles.css';

const SongSearch = ({ song, songs, onCorrectGuess, onIncorrectGuess }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [isIncorrectGuess, setIsIncorrectGuess] = useState(false);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    setIsSearchClicked(true);
  };

  const handleItemClick = (title, artist) => {
    setSelectedItem(title + ' - ' + artist);
    setSearchQuery(title + ' - ' + artist);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (searchQuery.toLowerCase() === (song.song_title + ' - ' + song.artist).toLowerCase()) {
        console.log('Guess is correct!');
        setIsIncorrectGuess(false);
        onCorrectGuess();
      } else {
        console.log('Guess is incorrect!');
        setIsIncorrectGuess(true);
        onIncorrectGuess();
      }
    }
  };

  const filteredSongs = songs
    .filter((song) => {
      const titleMatch = song.song_title.toLowerCase().includes(searchQuery.toLowerCase());
      const lengthMatch = song.artist.toLowerCase().includes(searchQuery.toLowerCase());
      return titleMatch || lengthMatch;
    })
    .sort((a, b) => a.song_title.localeCompare(b.song_title));

  const isSongSelected = selectedItem === searchQuery;
  const searchBarClass = isSongSelected ? 'selected' : '';

  return (
    <div className='allSearch'>
      <div className='song-search'>
        <input
          type='text'
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyPress}
          placeholder='Search for a song'
          onClick={handleSearchClick}
          className={searchBarClass}
          id='searchBar'
        />

        {isSearchClicked && (
          <div className='song-list-container'>
            <ul className='song-list'>
              {filteredSongs.map((song, index) => (
                <li key={index} onClick={() => handleItemClick(song.song_title, song.artist)}>
                  {song.song_title} - {song.artist}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
      {isIncorrectGuess && (
        <div className='error-message'>
          <h1>Incorrect! Try again!</h1>
        </div>
      )}
    </div>
  );
};

export default SongSearch;
