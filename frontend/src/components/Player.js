import { useEffect, useRef, useState, useReducer } from 'react';
import '../player_styles.css';

const Player = ({ song, skip_init, onSkip }) => {
  const widgetRef = useRef(null);
  const playButtonRef = useRef(null);

  const initialState = {
    currentTime: 0,
    duration: 15,
    isPlaying: false,
    sliderValue: 0,
    // skip: skip_init,
    skips: [1, 3, 6, 10, 15]
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

  // connects to API and initialize sound cloud widget
  useEffect(() => {
    if (!window.SC) {
      const script = document.createElement('script');
      script.src = 'https://w.soundcloud.com/player/api.js';
      script.async = true;
      script.onload = initializeWidget;
      document.body.appendChild(script);
    } else {
      initializeWidget();
    }

    function initializeWidget() {
      if (!widgetRef.current) {
        widgetRef.current = window.SC.Widget(document.getElementById('iFrame'));

        widgetRef.current.bind(window.SC.Widget.Events.READY, () => {
          widgetRef.current.bind(window.SC.Widget.Events.READY, () => {
            widgetRef.current.getDuration((soundDuration) => {
              dispatch({ type: 'SET_DURATION', payload: soundDuration / 1000 });
            });
          });

          widgetRef.current.bind(window.SC.Widget.Events.FINISH, () => {
            console.log('Track finished');
          });
        });
      }
    }
  }, []);

  const [isLoaded, setIsLoaded] = useState(false);

  // wait until iFrame is loaded to load controls
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

  // updates the time slider value and keeps track of skip count
  useEffect(() => {
    if (isPlaying) {
      if (currentTime >= skips[skip_init]) {
        widgetRef.current.pause();
        dispatch({ type: 'SET_IS_PLAYING', payload: false });
      }
      else {
        const interval = setInterval(() => {
          dispatch({ type: 'SET_CURRENT_TIME', payload: currentTime + 0.1 });
          dispatch({ type: 'SET_SLIDER_VALUE', payload: currentTime });
        }, 100);

        return () => clearInterval(interval);
      }
    }
  }, [isPlaying, currentTime, skip_init, skips]);

  const playSong = () => {
    if (widgetRef.current) {
      // to avoid continual play once the game has begun
      if (currentTime == 0){
        // hit play on iframe to load player (on first play)
        widgetRef.current.play();
        // timeout to wait for audio to load
        setTimeout(() => {
          // once loaded, play the song
          restartSong(); 
          // increment bar once song is playing
          dispatch({ type: 'SET_IS_PLAYING', payload: true }); 
        }, 900);
      }
    }
  };

  const pauseSong = () => {
    if (widgetRef.current) {
      widgetRef.current.pause();
      dispatch({ type: 'SET_IS_PLAYING', payload: false });
    }
  };

  const restartSong = () => {
    if (widgetRef.current) {
      widgetRef.current.seekTo(0);
      widgetRef.current.play();
      dispatch({ type: 'SET_IS_PLAYING', payload: true });
      dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
      dispatch({ type: 'SET_SLIDER_VALUE', payload: 0 });
    }
  };

  const skipUpdate = () => {
    if (widgetRef.current) {
      // dispatch({ type: 'SET_SKIP_VALUE', payload: skip_init + 1 });
      // skip_init = skip_init + 1
      onSkip()
      restartSong()
    }
  };

  const handleSliderChange = (event) => {
    const sliderValue = parseInt(event.target.value);

    // Disable slider if sliderValue is greater than skips[skip_init]
    if (sliderValue > skips[skip_init]) {
      return;
    }

    dispatch({ type: 'SET_SLIDER_VALUE', payload: sliderValue });
    const newPosition = sliderValue;
    dispatch({ type: 'SET_CURRENT_TIME', payload: newPosition });

    if (widgetRef.current) {
      widgetRef.current.seekTo(newPosition * 1000);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='player'>
      <div className='slider-container'>
        <div className="time-label current-time-label">{formatTime(currentTime)}</div>
        <input
          type="range"
          min="0"
          max="15"
          step="0.1"
          value={sliderValue}
          onChange={handleSliderChange}
          className="song-slider"
          list="ticks"
        />
        <div className="time-label duration-label">{formatTime(duration)}</div>
        <datalist id="ticks">
          <option>0</option>
          <option>1</option>
          <option>3</option>
          <option>6</option>
          <option>10</option>
          <option>15</option>
        </datalist>
      </div>
      <div className="game-layout" style={{ display: isLoaded ? 'block' : 'none' }}>
        <div className="player-controls">
          <button onClick={playSong} ref={playButtonRef}>PLAY</button>
          <button onClick={pauseSong}>PAUSE</button>
          <button onClick={restartSong}>RESTART</button>
          <button id="skip" onClick={skipUpdate}>SKIP</button>
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
