import { useEffect, useRef, useState, useReducer } from 'react';
import '../component_styles/player_styles.css';

const Player = ({ song, skip_init, onSkip }) => {
  const widgetRef = useRef(null);
  const playPauseRef = useRef(null);
  const giveUpRef = useRef(null);
  const skipRef = useRef(null);

  // Make sure not to over-index the skips array
  if (skip_init > 4) {
    skip_init = 4
  }

  const initialState = {
    currentTime: 0,
    duration: 150,
    isPlaying: false,
    sliderValue: 0,
    // skip: skip_init,
    skips: [10, 30, 60, 100, 150]
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_CURRENT_TIME':
        return { ...state, currentTime: action.payload };
      // case 'SET_DURATION':
      //   return { ...state, duration: action.payload };
      case 'SET_IS_PLAYING':
        return { ...state, isPlaying: action.payload };
      case 'SET_SLIDER_VALUE':
        return { ...state, sliderValue: action.payload };
      case 'SET_SKIP_VALUE':
        return { ...state, skip_init: action.payload > 4 ? 4 : action.payload };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentTime, duration, isPlaying, sliderValue, skips } = state;

  // Connects to API and initializes the SoundCloud widget
  useEffect(() => {
    // If the SoundCloud API script hasn't been added, add it to the HTML.
    if (!window.SC) {
      const script = document.createElement('script');
      script.src = 'https://w.soundcloud.com/player/api.js';
      script.async = true;
      script.onload = initializeWidget;
      document.body.appendChild(script);
    } else {
      initializeWidget();
    }

    // Initialize the SoundCloud widget.
    function initializeWidget() {
      if (!widgetRef.current) {
        // Set the widgetRef to point to the IFrame.
        widgetRef.current = window.SC.Widget(document.getElementById('iFrame'));

        widgetRef.current.bind(window.SC.Widget.Events.READY, () => {
          // widgetRef.current.bind(window.SC.Widget.Events.READY, () => {
          //   widgetRef.current.getDuration((soundDuration) => {
          //     dispatch({ type: 'SET_DURATION', payload: soundDuration / 1000 });
          //   });
          // });

          widgetRef.current.bind(window.SC.Widget.Events.FINISH, () => {
            console.log('Track finished');
          });
        });
      }
    }
  }, []);

  const [isLoaded, setIsLoaded] = useState(false);

  // Wait until iFrame is loaded to load controls
  useEffect(() => {

    // Add event listener for iframe load event
    const handleLoad = () => {
      setIsLoaded(true);
    };
    document.getElementById('iFrame').addEventListener('load', handleLoad);

    // Clean up the event listener
    return () => {
      document.getElementById('iFrame').removeEventListener('load', handleLoad);
    };
  }, []);

  // Updates the time slider value and keeps track of skip count
  useEffect(() => {
    if (isPlaying) {
      if (currentTime >= skips[skip_init]) {
        widgetRef.current.pause();
        playPauseRef.current.innerHTML = "PLAY"
        dispatch({ type: 'SET_IS_PLAYING', payload: false });
      }
      else {
        const interval = setInterval(() => {
          dispatch({ type: 'SET_CURRENT_TIME', payload: currentTime + 1 });
          dispatch({ type: 'SET_SLIDER_VALUE', payload: currentTime + 1 });
        }, 100);

        return () => clearInterval(interval);
      }
    }
  }, [isPlaying, currentTime, skip_init, skips]);

  // Play and pause the song as needed
  const playPauseSong = () => {
    if (widgetRef.current) {
      if (!isPlaying) {
        // If you play the song, change the play/pause button text
        playPauseRef.current.innerHTML = "PAUSE"
        // to avoid continual play once the game has begun
        if (currentTime === 0) {
          // hit play on iframe to load player (on first play).
          // Then pause it immediately after to prevent double audio playing.
          widgetRef.current.play();
          widgetRef.current.pause();
          // timeout to wait for audio to load
          setTimeout(() => {
            // once loaded, play the song
            restartSong();
            // increment bar once song is playing
            dispatch({ type: 'SET_IS_PLAYING', payload: true });
          }, 900);
        }
        // If you are at the max time and press play, restart the song
        else if (currentTime >= skips[skip_init]){
          restartSong()
        }
        else {
          widgetRef.current.play();
          dispatch({ type: 'SET_IS_PLAYING', payload: true });
        }
      }
      else {
          // If you pause the song, change the play/pause button text
          playPauseRef.current.innerHTML = "PLAY"
          widgetRef.current.pause();
          dispatch({ type: 'SET_IS_PLAYING', payload: false });
      }
    }
  };

  // Restart the song, making it play immediately from the beginning
  const restartSong = () => {
    if (widgetRef.current) {
      widgetRef.current.seekTo(0);
      widgetRef.current.play();
      // If you restart the song, change the play/pause button text
      playPauseRef.current.innerHTML = "PAUSE"
      dispatch({ type: 'SET_IS_PLAYING', payload: true });
      dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
      dispatch({ type: 'SET_SLIDER_VALUE', payload: 0 });
    }
  };

  // Update the number of skips you have used, and restart the song
  const skipUpdate = () => {
    if (widgetRef.current) {
      onSkip()

      // Disable the skip button if the user has no more skips.
      // For some reason this is out of sync, hence the >= 3 and not >= 4
      if (skip_init >= 3) {
        skipRef.current.disabled = true;
      }
      else {
        restartSong()
      }
    }
  };

  // Give up!
  const giveUp = () => {
    if (widgetRef.current) {
      skip_init = 4
      // Pass 'Give up' to the Home component so it knows to make you lose
      onSkip('Give up')
      giveUpRef.current.disabled = true;
      skipRef.current.disabled = true;
    }
  }

  const handleSliderChange = (event) => {
    if (widgetRef.current) {
      const sliderValue = parseInt(event.target.value);

      // Disable slider if sliderValue is greater than skips[skip_init]
      if (sliderValue > skips[skip_init]) {
        return;
      }

      dispatch({ type: 'SET_SLIDER_VALUE', payload: sliderValue });
      dispatch({ type: 'SET_CURRENT_TIME', payload: sliderValue });
      widgetRef.current.seekTo(sliderValue * 100);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 600);
    const seconds = Math.floor((time % 600)/10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='player'>
      <div className='slider-container'>
        <div className="time-label current-time-label">{formatTime(currentTime)}</div>
        <input
          type="range"
          min="0"
          max="150"
          step="1"
          value={sliderValue}
          onChange={handleSliderChange}
          className="song-slider"
          list="ticks"
        />
        <div className="time-label duration-label">{formatTime(duration)}</div>
        <datalist id="ticks">
          <option>0</option>
          <option>10</option>
          <option>30</option>
          <option>60</option>
          <option>100</option>
          <option>150</option>
        </datalist>
      </div>
      <div className="game-layout" style={{ display: isLoaded ? 'block' : 'none' }}>
        <div className="player-controls">
          <button onClick={giveUp} ref={giveUpRef}>GIVE UP</button>
          <button onClick={playPauseSong} ref={playPauseRef}>PLAY</button>
          <button id="skip" onClick={skipUpdate} ref={skipRef}>SKIP</button>
        </div>
      </div>
      <iframe
        width="100%"
        height="200"
        id="iFrame"
        title="player"
        allow="autoplay"
        src={song.soundcloud_link}
        loading='eager'
      />
    </div>

  );
};

export default Player;
