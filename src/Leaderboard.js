import './App.css';
import TeamsLeaderboard from './Teams';
import config from './config';

export const processRankings = (activities, athletes) => {
  const athletes2 = JSON.parse(JSON.stringify(athletes));
  activities.forEach( activity => {
    athletes2[activity.athlete.firstname].minutes += Math.round(activity.moving_time / 60);
  })
  const sortedAthletes = Object.entries(athletes2).sort(([,a],[,b]) => b.minutes-a.minutes);
  return sortedAthletes;
}

export const renderRankChange = (currentRank, previousRank) => {
  if(currentRank > previousRank) return <div className="progress down">&#8595;</div>;
  if(currentRank < previousRank) return <div className="progress up">&#8593;</div>;
  return null;
}

export default function App() {

  const getAllData = () => {
    const context = require.context('./data', true, /.json$/);
    const allData = [];
    context.keys().forEach((key) => {
      const fileName = key.replace('./', '');
      const resource = require(`./data/${fileName}`);
      allData.push(JSON.parse(JSON.stringify(resource)))
    });
    allData.reverse();
    return allData;
  }

  const findAthletesTeam = ({firstname}) => {
    const team = Object.entries(config.teams).find( ([, members]) => members.includes(firstname));
    if(!team) return "Other";
    return team[0];
  }

  const getAthletes = (activities) => {
    const athletes = {};
    activities.forEach( ({ athlete }) => {
      const { firstname } = athlete;
      athletes[firstname] = {
        minutes: 0,
        team: findAthletesTeam(athlete)
      };
    });
    return athletes;
  }

  const findNewActivities = (newData, oldData) => {
    return newData.filter( newActivity => {
      const existsInOldData = oldData.find( oldActivity => {
        return JSON.stringify(newActivity) === JSON.stringify(oldActivity)
      });
      return !existsInOldData;
    })
  }

  const getRecentData = ([currentWeek, lastWeek, weekBeforeLast]) => {
    if(!weekBeforeLast) weekBeforeLast = {data: []};
    //above check only required for first two weeks of running (insufficient data)
    return {
      currentWeek: findNewActivities(currentWeek.data, lastWeek.data),
      lastWeek: findNewActivities(lastWeek.data, weekBeforeLast.data)
    };
  };

  const renderLeaderboard = (currentWeekActivities, lastWeekActivities, athletes) => {
    const currentRankings = processRankings(currentWeekActivities, athletes);
    const previousRankings = processRankings(lastWeekActivities, athletes);

    return currentRankings.map( ([athleteName, {minutes}], i) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const noActivity = !hours && !mins;

      const athleteInPreviousData = previousRankings.find(([name]) => athleteName === name);
      const previousRank = previousRankings.indexOf(athleteInPreviousData) + 1;
      const currentRank = i + 1;

      return <div className="rank">
        <div className="athlete">
          #{currentRank} {athleteName}
        </div>
        <div className="time">
          {noActivity && "No actvity"}
          {hours > 0 && `${hours} hrs `}
          {mins > 0 && `${mins} mins`}
        </div>
        <div className="progress">
          {renderRankChange(currentRank, previousRank)}
        </div>
      </div>
    });
  }

  const allData = getAllData();
  const {currentWeek, lastWeek } = getRecentData(allData);
  const athletes = getAthletes([...currentWeek, ...lastWeek]);

  const currentWeekNumber = allData[0].week;
  const currentWeekDate = allData[0].date;
  const lastWeekDate = allData[1].date;

  return (
    <div className="App">
      <header className="App-header">
        <h3>Fixter Champions - Week {currentWeekNumber}</h3>
        <p>{lastWeekDate} to {currentWeekDate}</p>
      </header>
      <div className="section">
        <div class="title">Solo Rankings</div>
        {renderLeaderboard(currentWeek, lastWeek, athletes)}
      </div>
      <div className="section">
        <div class="title">Team Rankings</div>
        <TeamsLeaderboard athletes={athletes} activities={{currentWeek, lastWeek}} />
      </div>
    </div>
  );
}