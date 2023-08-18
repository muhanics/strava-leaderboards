import './App.css';
import TeamsLeaderboard from './Teams';
import config from './config';
import { processRankings, renderRankChange, mapName, formatDateByFilename } from './utils';

export default function App() {

  const getAllData = (startingIndex = 0) => {
    const context = require.context('./data', true, /.json$/);
    const allData = [];
    context.keys().forEach((key, i) => {
      const fileName = key.replace('./', '');
      const resource = require(`./data/${fileName}`);

      const activitySet = {
        week: i,
        date: formatDateByFilename(fileName),
        activities: JSON.parse(JSON.stringify(resource))
      };

      allData.push(activitySet)
    });
    allData.reverse();
    console.log("allData", allData);
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
    console.log("newData", newData);
    console.log("oldData", oldData);
    return newData.filter( newActivity => {
      const existsInOldData = oldData.find( oldActivity => {
        return JSON.stringify(newActivity) === JSON.stringify(oldActivity)
      });
      return !existsInOldData;
    })
  }

  const concatData = (datasets) => {
    console.log("datasets", datasets);
    return datasets.map( ({activities}) => activities).flat();
  }

  const getRecentData = ([currentWeek, lastWeek, weekBeforeLast]) => {
    if(!weekBeforeLast) weekBeforeLast = {data: []};
    //above check only required for first two weeks of running (insufficient data)
    const dataBeforeCurrentWeek = concatData(getAllData(1));
    const dataBeforeLastWeek = concatData(getAllData(2));

    console.log("dataBeforeCurrentWeek", dataBeforeCurrentWeek);
    console.log("dataBeforeLastWeek", dataBeforeLastWeek);

    return {
      currentWeek: findNewActivities(currentWeek.activities, dataBeforeCurrentWeek),
      lastWeek: findNewActivities(lastWeek.activities, dataBeforeLastWeek)
    };
  };

  const renderLeaderboard = (currentWeekActivities, lastWeekActivities, athletes) => {
    const currentRankings = processRankings(currentWeekActivities, athletes);
    const previousRankings = processRankings(lastWeekActivities, athletes);

    console.log("CUrrent rankings", currentRankings);
    return currentRankings.map( ([athleteName, {minutes}], i) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const noActivity = !hours && !mins;

      const athleteInPreviousData = previousRankings.find(([name]) => athleteName === name);
      const previousRank = previousRankings.indexOf(athleteInPreviousData) + 1;
      const currentRank = i + 1;
      const originalName = athleteName.replace(`_`, ' ');
      const displayName = mapName(originalName, config.nameMappings);

      return <div className="rank">
        <div className="athlete">
          #{currentRank} {displayName}
        </div>
        <div className="time">
          {noActivity && "No activity"}
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