import { useEffect, useRef, useState } from 'react';
import '../styles.css';

const Player = ({ song }) => {
  const widgetRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

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
            setCurrentTime(position);
            setSliderValue((position / duration) * 100);
          });

          widgetRef.current.bind(window.SC.Widget.Events.READY, () => {
            widgetRef.current.getDuration((soundDuration) => {
              setDuration(soundDuration / 1000);
            });
          });

          widgetRef.current.bind(window.SC.Widget.Events.FINISH, () => {
            console.log('Track finished');
          });
        });
      }
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 0.1);
        setSliderValue((currentTime / duration) * 100);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTime, duration]);

  function playSong() {
    if (widgetRef.current) {
      widgetRef.current.play();
      setIsPlaying(true);
    }
  }

  function pauseSong() {
    if (widgetRef.current) {
      widgetRef.current.pause();
      setIsPlaying(false);
    }
  }

  function restartSong() {
    if (widgetRef.current) {
      widgetRef.current.seekTo(0);
      widgetRef.current.play();
      setIsPlaying(true);
      setCurrentTime(0);
      setSliderValue(0);
    }
  }

  function handleSliderChange(event) {
    const sliderValue = parseInt(event.target.value);
    setSliderValue(sliderValue);
    const newPosition = (sliderValue / 100) * duration;
    setCurrentTime(newPosition);
    if (widgetRef.current) {
      widgetRef.current.seekTo(newPosition * 1000);
    }
  }

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
}

export default Player;
