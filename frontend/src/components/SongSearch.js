import { useState } from 'react';
import '../songsearch_styles.css';

const SongSearch = ({ song, songs, onIncorrectGuess }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    setIsSearchClicked(true);
  };

  const handleItemClick = (title, artist) => {
    setSelectedItem(title + " - " + artist);
    setSearchQuery(title + " - " +  artist);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Perform your comparison logic here
      if (searchQuery.toLowerCase() === (song.song_title + " - " + song.artist).toLowerCase()) {
        console.log('Guess is correct!');
      } else {
        console.log('Guess is incorrect!');
        onIncorrectGuess();
      }
    }
  };

  const filteredSongs = songs
    .filter((song) => song.song_title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.song_title.localeCompare(b.song_title));

  const isSongSelected = selectedItem === searchQuery;
  const searchBarClass = isSongSelected ? 'selected' : '';

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        onKeyDown={handleKeyPress}
        placeholder="Search for a song"
        onClick={handleSearchClick}
        className={searchBarClass}
      />

      {isSearchClicked && (
        <div className="song-list-container">
          <ul className="song-list">
            {filteredSongs.map((song, index) => (
              <li key={index} onClick={() => handleItemClick(song.song_title, song.artist)}>
                {song.song_title} - {song.artist}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SongSearch;
