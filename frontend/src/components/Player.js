import { useEffect, useRef } from 'react';
import '../styles.css';

const Player = ({song}) => {
  const widgetRef = useRef(null);

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

          // Example: Bind an event listener to track finish
          widgetRef.current.bind(window.SC.Widget.Events.FINISH, () => {
            console.log('Track finished');
          });
        });
      }
    }
  }, []);

  function playSong() {
    if (widgetRef.current) {
      widgetRef.current.play();
    }
  }

  function pauseSong() {
    if (widgetRef.current) {
      widgetRef.current.pause();
    }
  }

  function restartSong() {
    if (widgetRef.current) {
      widgetRef.current.seekTo(0);
      widgetRef.current.play();
    }
  }

  return (
    <div className='player'>
      <button onClick={playSong}>PLAY</button>
      <button onClick={pauseSong}>PAUSE</button>
      <button onClick={restartSong}>RESTART</button>
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
