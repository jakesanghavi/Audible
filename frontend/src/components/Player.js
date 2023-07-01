import { useEffect, useRef, useReducer } from 'react';
import '../styles.css';

const Player = ({ song }) => {
  const widgetRef = useRef(null);

  const initialState = {
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    sliderValue: 0,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_CURRENT_TIME':
        return { ...state, currentTime: action.payload };
      case 'SET_DURATION':
        return { ...state, duration: action.payload };
      case 'SET_IS_PLAYING':
        return { ...state, isPlaying: action.payload };
      case 'SET_SLIDER_VALUE':
        return { ...state, sliderValue: action.payload };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentTime, duration, isPlaying, sliderValue } = state;

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
          widgetRef.current.bind(window.SC.Widget.Events.PLAY_PROGRESS, ({ currentSound }) => {
            const position = currentSound.currentPosition / 1000;
            dispatch({ type: 'SET_CURRENT_TIME', payload: position });
            dispatch({ type: 'SET_SLIDER_VALUE', payload: (position / duration) * 100 });
          });

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
  }, [duration]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        dispatch({ type: 'SET_CURRENT_TIME', payload: currentTime + 0.1 });
        dispatch({ type: 'SET_SLIDER_VALUE', payload: (currentTime / duration) * 100 });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTime, duration]);

  const playSong = () => {
    if (widgetRef.current) {
      widgetRef.current.play();
      dispatch({ type: 'SET_IS_PLAYING', payload: true });
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

  const handleSliderChange = (event) => {
    const sliderValue = parseInt(event.target.value);
    dispatch({ type: 'SET_SLIDER_VALUE', payload: sliderValue });
    const newPosition = (sliderValue / 100) * duration;
    dispatch({ type: 'SET_CURRENT_TIME', payload: newPosition });
    if (widgetRef.current) {
      widgetRef.current.seekTo(newPosition * 1000);
    }
  };

  return (
    <div className='player'>
      <button onClick={playSong}>PLAY</button>
      <button onClick={pauseSong}>PAUSE</button>
      <button onClick={restartSong}>RESTART</button>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        onChange={handleSliderChange}
        className="slider"
      />
      <div className="progress-bar">
        <div className="progress" style={{ width: `${sliderValue}%` }}></div>
      </div>
      <iframe
        width="100%"
        height="200"
        id="iFrame"
        title="player"
        allow="autoplay"
        src={song.soundcloud_link}
      ></iframe>
    </div>
  );
};

export default Player;
