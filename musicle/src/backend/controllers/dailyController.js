const dailySong = require('../models/daily_model.js')

// GET one song
const getDailySong = async (request, response) => {
    const currentDate = new Date().toJSON().slice(0, 10);

    const query = { current_date: currentDate };

    try {
        // Query the dailySong collection to find the song with the current date
        const song = await dailySong.findOne(query);

        if (!song) {
            return response.status(500).json({ error: 'Internal server error.' });
        }

        return response.status(200).json(song);
    } catch (error) {
        console.error('Error retrieving song:', error);
        return response.status(500).json({ error: 'Internal server error.' });
    }

}

module.exports = {
    getDailySong
}
