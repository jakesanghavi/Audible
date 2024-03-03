import { useState, useRef, useEffect } from 'react';
import '../component_styles/songsearch_styles.css';

// Search Bar and List of Filtered Songs
const SongSearch = ({ song, songs, onCorrectGuess, onIncorrectGuess, onIncorrectSearch, decodeHTMLEntities }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListShown, setIsListShown] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  const isSongSelected = selectedItem === searchQuery;      // if a song was selected
  const searchBarClass = isSongSelected ? 'selected' : '';  // style for if song was selected
  const searchRef = useRef(null);

  // get title without artist information 
  //   function parseTitle(songTitle){
  //     // split title based on "- " (present with artist)
  //     let arr = songTitle.split("- ");

  //     // return parsed title
  //     return arr[arr.length - 1];
  //   }

  // Create a hashmap of all songs/artists in the DB
  const map = {};
  songs.forEach((obj) => {
    // console.log(obj)
    const key = (obj.song_title + ' - ' + obj.artist).toLowerCase();
    map[key] = 1;
  });

  // // Some strings have HTML characters. This converts them to English.
  // const decodeHTMLEntities = (text) => {
  //   const parser = new DOMParser();
  //   const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
  //   return decodedString;
  // };

  // Filter songs that match substring of query (in song or artist name)
  const filteredSongs = songs
    .filter((song) => {
      const titleMatch = song.song_title.toLowerCase().includes(searchQuery.toLowerCase());
      const lengthMatch = song.artist.toLowerCase().includes(searchQuery.toLowerCase());
      return titleMatch || lengthMatch;
    })
    .sort((a, b) => a.song_title.localeCompare(b.song_title));

  // When the user searches a song, update input field
  const handleSearch = (event) => {
    // make sure list is showing 
    setIsListShown(true);
    // update search query
    setSearchQuery(event.target.value);
  };

  // When user clicks the search bar (method avoids re-render crash)
  const handleSearchClicked = () => {
    setIsListShown(true);
  }

  // When the user clicks on a song in the list, set item as selected
  const handleItemClick = (title, artist) => {
    // select the song
    setSelectedItem(title + ' - ' + artist);
    // display song in search
    setSearchQuery(title + ' - ' + artist);
    // re-focus on input (for easy submit)
    document.getElementById("searchBar").focus();

    // hide the song list
    setIsListShown(false);
  };

  // When user presses a key (in search bar)
  const handleKeyPress = async (event) => {

    // if they are submitting
    if (event.key === 'Enter') {
      // Disallow the user from searching songs that are not in the DB
      if (map[searchQuery.toLowerCase()] === undefined) {
        return;
      }

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

  // Closes the song list if the user clicks outside of it
  useEffect(() => {
    // If the user clicks outside of the list, close it
    const handleClickOutside = (event) => {
      if (searchRef.current && event.target !== searchRef.current) {
        setIsListShown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Remove up the event listener when it's not needed.
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='allSearch' id='allSearch'>
      <div className='song-search'>
        {/* Search Bar */}
        <input
          type='text'
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyPress}
          placeholder='Search for a song'
          onClick={handleSearchClicked}
          className={searchBarClass}
          ref={searchRef}
          id='searchBar'
        />

        {/* Song List (shown when searching) */}
        {isListShown && (
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
