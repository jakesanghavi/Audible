const GuessesStats = ({ played, solveRate, avgGuesses, statsType }) => {
    return (
        <div>
          <p><strong>{statsType} Stats:</strong></p>
          <div class="results-grid container">
            <div class="row">
              <div class="col-3">
                <div class="num" id="resultPlayed">{played}</div>
                <div class="txt" id="resultPlayedTxt">Played</div>
              </div>
              <div class="col-3">
                <div class="num" id="resultWinPerc">{solveRate}</div>
                <div class="txt" id="resultWinPercTxt">Win %</div>
              </div>
              <div class="col-3">
                <div class="num" id="resultStreakMax">{avgGuesses}</div>
                <div class="txt" id="resultStreakMaxTxt">Average Guesses</div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default GuessesStats;