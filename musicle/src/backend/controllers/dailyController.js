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

// const patchDailySong = async (request, response) => {
//     const guessNum = request.body.todayGuesses;
//     const lastDay = request.body.lastDay;

//     const dailySong = await Daily.findOne({ current_date: lastDay });
//     console.log('hello?')

//     if (dailySong && guessNum) {
//         const updated = await Daily.findOneAndUpdate(
//                   { current_date: lastDay },
//                   { $push: { user_guesses: guessNum } },
//                   { new: true }
//                 );
//     }
//     else {
//         console.log('err!')
//     }
// }

module.exports = {
    getDailySong
}
