import { useEffect, useRef } from 'react';
import '../styles.css';

const Player = () => {
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

          // Example: Seek to a specific position (in milliseconds)
          const seekToPosition = 30000; // 30 seconds
          widgetRef.current.seekTo(seekToPosition);
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

  return (
    <div className='player'>
      <button onClick={playSong}>PLAY</button>
      <button onClick={pauseSong}>PAUSE</button>
      <iframe
        width="100%"
        height="200"
        id="iFrame"
        title="player"
        allow="autoplay"
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/983989414&color=%23050301&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false"
      ></iframe>
    </div>
  );
}

export default Player;
