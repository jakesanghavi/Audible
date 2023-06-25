import {useEffect, useState} from 'react'
import SongDetails from '../components/SongDetails'
import Player from '../components/Player'

const Home = () => {

    const [songs, setSongs] = useState(null)

    // fire only once (when component renders)
    useEffect(() => {
        const fetchSongs = async() => {
            const response = await fetch('http://localhost:4000/api/songs')
            const json = await response.json()

            if(response.ok) {
                setSongs(json)
            }
        }

        fetchSongs()

    }, [])

    return(
        <div className='Home'>
            <div className='songs'>
                {songs && songs.map((song) => (
                    <SongDetails key={song._id} song={song}/>
                ))}
            </div>
            <Player/>
        </div>
    )
}

export default Home