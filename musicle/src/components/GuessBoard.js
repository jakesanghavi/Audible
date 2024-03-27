import '../component_styles/guessboard_styles.css';
import React from 'react';

// Guess container
const GuessBoard = ({ guesses }) => {

  console.log(guesses)

  // Some song titles have stuff like "&amp;". This turns those into readable text, i.e. "&"
  const decodeHTMLEntities = (text) => {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
    return decodedString;
  };

  // If the user hasn't guessed, just make the board blank
  if(!guesses || guesses === null || guesses.length === 0) {
    return (
      <div className="guess-container">
        <li className="left-column">Guess 1:</li>
        <li className='guess-content'>-------</li>
        <li className="left-column">Guess 2:</li>
        <li className='guess-content'>-------</li>
        <li className="left-column">Guess 3:</li>
        <li className='guess-content'>-------</li>
        <li className="left-column">Guess 4:</li>
        <li className='guess-content'>-------</li>
        <li className="left-column">Guess 5:</li>
        <li className='guess-content'>-------</li>
      </div>
    )
  }
  // If the user has guessed ...
  else {
    // Make a guesses array populated with their guesses. If they haven't yet made all 5,
    // fill the remaining spots with blanks
    const paddedGuesses = guesses.concat(Array(Math.max(5 - guesses.length, 0)).fill("-------"));

    return (
      <div className="guess-container">
        {[1, 2, 3, 4, 5].map((index) => {
          // Separate the guess into class and title
          // I made the stored guessed stored as "{color} {title}" for ease of use
          const guess = paddedGuesses[index - 1];
          const firstSpaceIndex = guess.indexOf(" ");
          // The class is before the first space
          const guessClass = firstSpaceIndex !== -1 ? guess.substring(0, firstSpaceIndex) : "";
          // The content/title is after the first space
          const guessContent = firstSpaceIndex !== -1 ? guess.substring(firstSpaceIndex + 1) : guess;
          
          return (
            // Return all of the guesses back to the board
            <React.Fragment key={index}>
              <li className="left-column">Guess {index}:</li>
              <li className={`guess-content ${guessClass}`}>{decodeHTMLEntities(guessContent)}</li>
            </React.Fragment>
          );
        })}
      </div>
    );
  }
  
};

export default GuessBoard;