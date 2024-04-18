import { useEffect, useState } from 'react'
import StatsPlot from '../components/StatsPlot'

// The profile page for the user
const Profile = ({ onLogout, loggedInUser, userStats }) => {
  const [user, setUser] = useState(null);
  const [myData, setMyData] = useState({average: 0, solve_rate: "0%"});

  const averageAndRateWithoutNulls = (array) => {
    if (!array || array.length === 0) {
      return { average: 0, count: "0%" };
    }
    // Filter out null values
    const filteredArray = array.filter(value => value !== null);

    // Calculate the count of non-null entries
    const count = filteredArray.length;

    // Check if there are non-null values in the array
    if (count === 0) {
        return { average: 0, count: "0%" }; // Handle case where all values are null
    }

    // Calculate the sum of the remaining values
    const sum = filteredArray.reduce((acc, currentValue) => acc + currentValue, 0);

    // Calculate the average
    const average = (sum / count).toFixed(2);
    const solve_rate = (count/array.length).toFixed(2) * 100 + "%";

    return { average, solve_rate };
  }

  useEffect(() => {
    if(loggedInUser) {
      setUser(loggedInUser);
    }
  }, [loggedInUser]);

  useEffect(() => {
    setMyData(averageAndRateWithoutNulls(userStats))
  }, [userStats])

  // Make the user also navigate back to the home page when they log out
  const backHome = () => {
    window.location.href = '/';
  }

  return (
    <div>
      <div>
        {user ? user.username : null}
      </div>
      <div>
        Stats
      </div>
      <div>
        Average Guesses: {myData.average}
        <br/>
        Solve Rate: {myData.solve_rate}
      </div>
      <StatsPlot data={userStats}/>
      <button onClick={() => {onLogout(); backHome();}}>
        Sign out
      </button>
    </div>
  );
};




export default Profile;