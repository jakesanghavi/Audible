import { useEffect } from 'react';

const Player = () => {

    // useEffect(() => {
    //     const iframe = document.getElementById('playbutton-iframe');
    
    //     const onLoadHandler = () => {
    //       // Execute any communication with the iframe after it has fully loaded
    //       // For example, you can send a message to the iframe using postMessage
    //     };
    
    //     iframe.addEventListener('load', onLoadHandler);
    
    //     return () => {
    //       iframe.removeEventListener('load', onLoadHandler);
    //     };
    //   }, []);

    return (
        <div className='player'>
            <iframe id="playbutton-iframe" scrolling="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/255766429&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false"></iframe>
        </div>
    )
}

export default Player