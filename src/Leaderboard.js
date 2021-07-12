import './App.css';
import TeamsLeaderboard from './Teams';
import config from './config';
import { processRankings, renderRankChange } from './utils';

export default function App() {

  const getAllData = (startingIndex = 0) => {
    const context = require.context('./data', true, /.json$/);
    const allData = [];
    context.keys().forEach((key, i) => {
      const fileName = key.replace('./', '');
      const resource = require(`./data/${fileName}`);
      allData.push(JSON.parse(JSON.stringify(resource)))
    });
    allData.reverse();
    return allData.filter( (data, i) => i >= startingIndex);
  }

  const findAthletesTeam = ({firstname}) => {
    const team = Object.entries(config.teams).find( ([, members]) => members.includes(firstname));
    if(!team) return "Other";
    return team[0];
  }

  const getAthletes = (activities) => {
    const athletes = {};
    activities.forEach( ({ athlete }) => {
      const { firstname, lastname } = athlete;
      athletes[`${firstname}_${lastname}`] = {
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

  const concatData = (datasets) => {
    return datasets.map( ({data}) => data).flat();
  }

  const getRecentData = ([currentWeek, lastWeek, weekBeforeLast]) => {
    if(!weekBeforeLast) weekBeforeLast = {data: []};
    //above check only required for first two weeks of running (insufficient data)
    const dataBeforeCurrentWeek = concatData(getAllData(1));
    const dataBeforeLastWeek = concatData(getAllData(2));
    return {
      currentWeek: findNewActivities(currentWeek.data, dataBeforeCurrentWeek),
      lastWeek: findNewActivities(lastWeek.data, dataBeforeLastWeek)
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
      const displayName = athleteName.replace(`_`, ' ');

      return <div className="rank">
        <div className="athlete">
          #{currentRank} {displayName}
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
  console.log("all data", allData);
  const {currentWeek, lastWeek } = getRecentData(allData);

  console.log("cur week data", currentWeek);

  const athletes = getAthletes([...currentWeek, ...lastWeek]);

  const currentWeekNumber = allData[0].week;
  const currentWeekDate = allData[0].date;
  const lastWeekDate = allData[1].date;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fixter Champions - Week {currentWeekNumber}</h1>
        <p>{lastWeekDate} to {currentWeekDate}</p>
      </header>
      <div className="section">
        <h2 class="title">Solo Rankings</h2>
        {renderLeaderboard(currentWeek, lastWeek, athletes)}
      </div>
      <div className="section">
        <h2 class="title">Team Rankings</h2>
        <TeamsLeaderboard athletes={athletes} activities={{currentWeek, lastWeek}} />
      </div>
    </div>
  );
}