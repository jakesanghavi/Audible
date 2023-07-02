import {useEffect, useState} from 'react'
import SongDetails from '../components/SongDetails'
import Player from '../components/Player'

const Home = () => {

    const [song, setSongs] = useState(null)

    // fire only once (when component renders)
    useEffect(() => {
        const fetchRand = async() => {
            const response = await fetch('http://localhost:4000/api/songs/random/random')
            const json = await response.json()

            if(response.ok) {
                setSongs(json)
            }
        }

        fetchRand()

    }, [])

    return(
        <div className='Home'>
            <div className='songs'>
                {song && <Player song={song} />}
                {song && <SongDetails song={song} />}
            </div>
        </div>
    )
}

export default Home