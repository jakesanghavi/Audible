import { useState } from 'react';
import '../component_styles/songsearch_styles.css';

const SongSearch = ({ song, songs, onCorrectGuess, onIncorrectGuess, onIncorrectSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  // get title without artist information 
  function parseTitle(songTitle){
    // split title based on "- " (present with artist)
    let arr = songTitle.split("- ");

    // return parsed title
    return arr[arr.length - 1];
  }

  // Create a hashmap of all songs/artists in the DB
  const map = {};
  songs.forEach((obj) => {
    // console.log(obj)
    const key = (obj.song_title + ' - ' + obj.artist).toLowerCase();
    map[key] = 1;
  });

  // Some strings have HTML characters. This converts them to English.
  const decodeHTMLEntities = (text) => {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
    return decodedString;
  };

  // When the user searches a song, handle it
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // When the user clicks on the search bar, load the song names below.
  const handleSearchClick = () => {
    setIsSearchClicked(true);
  };

  // When the user clicks out of the search bar, get rid of song names
  const handleUnfocus = () => {
    setIsSearchClicked(false);
  }

  // When the user clicks on a song in the list, handle it
  const handleItemClick = (title, artist) => {
    setSelectedItem(title + ' - ' + artist);
    setSearchQuery(title + ' - ' + artist);
    // remove remaining border for song list 
    handleUnfocus();
  };

  // When the user presses enter inside of the search bar, handle their guess
  const handleKeyPress = async (event) => {
    // Disallow the user from searching songs that are not in the DB
    if (map[searchQuery.toLowerCase()] === undefined) {
      return;
    }

    // Once the user puts in a valid choice, check if they guessed correctly.
    if (event.key === 'Enter') {
      const regex = /.* - (.*)$/;
      if (searchQuery.toLowerCase() === (song.song_title + ' - ' + song.artist).toLowerCase()) {
        onCorrectGuess(searchQuery);
      } else if (regex.exec(searchQuery.toLowerCase())[1] === song.artist.toLowerCase()) {
        onIncorrectGuess();
        await onIncorrectSearch(searchQuery, 'y')
      }
      else {
        onIncorrectGuess();
        await onIncorrectSearch(searchQuery, 'r')
      }
      setSearchQuery('');
    }
  };

  // Filter for only songs which match a substring of the query, in either the song name
  // or the artist name
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
    <div className='allSearch' id='allSearch'>
      <div className='song-search' onMouseLeave={handleUnfocus}>
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
          // if a song has been entered into bar, don't render the list container div
          <>{filteredSongs.length === 0 ? null :
            <div className='song-list-container' id='song-list-container'>
              <ul className='song-list'>
                {filteredSongs.map((song, index) => (
                  <li key={index} onClick={() => handleItemClick(song.song_title, song.artist)}>
                    {decodeHTMLEntities(song.song_title)} - {decodeHTMLEntities(song.artist)}
                  </li>
                ))}
              </ul>
            </div>
          }</>
        )}
      </div>
    </div>
  );
};

export default SongSearch;
