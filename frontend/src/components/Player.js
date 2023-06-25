import { useEffect } from 'react';
import '../styles.css';

const Player = () => {
    let widget;
        function initializeWidget() {
            widget = window.SC.Widget(document.getElementById('iFrame'));
            widget.bind(window.SC.Widget.Events.READY, () => {
            // Example: Play the track
            //     widget.play();

            //     // Example: Pause the track after 5 seconds
            //     setTimeout(() => {
            //       widget.pause();
            //     }, 5000);

            // Example: Get the current playback position
            widget.getPosition((position) => {
              console.log('Current position:', position);
            });

            // Example: Bind an event listener to track finish
            widget.bind(window.SC.Widget.Events.FINISH, () => {
              console.log('Track finished');
            });

            // Example: Seek to a specific position (in milliseconds)
            const seekToPosition = 30000; // 30 seconds
            widget.seekTo(seekToPosition);
            });
        }

    // var widget;
    // useEffect(() => {
    //     if (!window.SC) {
    //       const script = document.createElement('script');
    //       script.src = 'https://w.soundcloud.com/player/api.js';
    //       script.async = true;
    //       script.onload = initializeWidget;
    //       document.body.appendChild(script);
    //     } else {
    //       initializeWidget();
    //     }

    //     function initializeWidget() {
    //       widget = window.SC.Widget(document.getElementById('iFrame'));

    //       widget.bind(window.SC.Widget.Events.READY, () => {
    //         // Example: Play the track
    //         widget.play();

    //         // Example: Pause the track after 5 seconds
    //         setTimeout(() => {
    //           widget.pause();
    //         }, 5000);

    //         // Example: Get the current playback position
    //         widget.getPosition((position) => {
    //           console.log('Current position:', position);
    //         });

    //         // Example: Bind an event listener to track finish
    //         widget.bind(window.SC.Widget.Events.FINISH, () => {
    //           console.log('Track finished');
    //         });

    //         // Example: Seek to a specific position (in milliseconds)
    //         const seekToPosition = 30000; // 30 seconds
    //         widget.seekTo(seekToPosition);
    //       });
    //     }

    //     // Clean up on component unmount
    //     return () => {
    //       if (widget) {
    // //         widget.unbindAll();
    //       }
    //     };
    //   }, []);
        

    function playSong(){
        if (!widget)
            widget = window.SC.Widget(document.getElementById('iFrame'));
        widget.play()
    }

    function pauseSong(){
        if (!widget)
            widget = window.SC.Widget(document.getElementById('iFrame'));
        widget.pause()
    }
    
    return (
        <div className='player'>
            <button onClick={playSong}>PLAY</button>
            <button onClick={pauseSong}>PAUSE</button>
            <iframe  height="0" scrolling="no" id="iFrame" title="player" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/983989414&color=%23050301&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false">hi</iframe>
        </div>
    )
}

export default Player