import { useRef, useEffect } from "react";
import '../component_styles/help_styles.css'

const Help = () => {

  const modalRef = useRef(null);

  const closeModal = () => {
    modalRef.current.style.display = 'none';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && event.target === modalRef.current) {
        closeModal();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div id="helpModal" ref={modalRef}>
      <div id="helpBody">
        <span className="close" onClick={closeModal}>&times;</span>
        <h3>Welcome to Musicle!</h3>
        <h1>How to Play</h1>
        <div id="helpDesc">
          Musicle is a Wordle-Inspired musical guessing game! <br></br><br></br>
          When you hit "Play", you will hear 1 second of a song. You will get 5 guesses to guess the given song, and with each guess, you will get to hear a few more seconds of the song! <br></br>
          On each turn, you can either guess, or "Skip" to increase the number of seconds the song will play for. <br></br>
          If you get super stumped, you can hit "Give Up"<br></br><br></br>
          Type in the search bar to search for a song. You can select the song you want to guess from the list, and hit ENTER to guess it. <br></br>
          If you guess the wrong song, but the correct artist, the guess will turn yellow. Otherwise, your guess will be red. <br></br>
          Good luck, and let's get Musicle!
        </div>
      </div>
    </div>
  );
};




export default Help;