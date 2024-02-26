// function to set a constant ()
function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  });
}

define("ORIGIN", 'https://musicle-official.netlify.app');
define("RANDOM_SONG",'https://musicle-official.onrender.com/api/songs/random/random');
define("ALL_SONGS", 'https://musicle-official.onrender.com/api/songs/');
define("ROUTE", 'https://musicle-official.onrender.com');

// For Development:
// define("ORIGIN", 'http://localhost:3000');
// define("RANDOM_SONG", 'http://localhost:3008/api/songs/random/random');
// define("ALL_SONGS", 'http://localhost:3008/api/songs/');
// define("ROUTE", 'http://localhost:3000');