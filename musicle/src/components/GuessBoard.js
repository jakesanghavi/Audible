import '../component_styles/guessboard_styles.css';
import React from 'react';

// Guess container
const GuessBoard = ({ guesses }) => {
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
  else {
    console.log(guesses)
    const paddedGuesses = guesses.concat(Array(Math.max(5 - guesses.length, 0)).fill("---"));

    return (
      <div className="guess-container">
        {[1, 2, 3, 4, 5].map((index) => {
          const guess = paddedGuesses[index - 1];
          const firstSpaceIndex = guess.indexOf(" ");
          const guessClass = firstSpaceIndex !== -1 ? guess.substring(0, firstSpaceIndex) : "";
          const guessContent = firstSpaceIndex !== -1 ? guess.substring(firstSpaceIndex + 1) : guess;
          
          return (
            <React.Fragment key={index}>
              <li className="left-column">Guess {index}:</li>
              <li className={`guess-content ${guessClass}`}>{guessContent}</li>
            </React.Fragment>
          );
        })}
      </div>
    );
  }
  
  // Pad the guesses array with "--- class" to ensure it has at least 5 elements
};

export default GuessBoard;