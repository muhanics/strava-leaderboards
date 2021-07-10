import { processRankings, renderRankChange } from "./Leaderboard";

export default function TeamsLeaderboard({athletes, activities}) {

    const groupIntoTeams = (rankings) => {
        const teams = {};
        rankings.forEach( ([athleteName, info]) => {
            const { minutes, team } = info;
            teams[team] = teams[team] || 0;
            teams[team] += minutes;
            console.log("athlete", athleteName, info);
        })
        const sortedTeams = Object.entries(teams).sort(([,a],[,b]) => b-a);
        console.log("sorted teams", sortedTeams);
        return sortedTeams;
    }

    const renderLeaderboard = (currentWeekActivities, lastWeekActivities, athletes) => {
        const currentRankings = groupIntoTeams(processRankings(currentWeekActivities, athletes));
        const previousRankings = groupIntoTeams(processRankings(lastWeekActivities, athletes));

        return currentRankings.map( ([teamname, minutes], i) => {
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          const noActivity = !hours && !mins;

          const athleteInPreviousData = previousRankings.find(([name]) => teamname === name);
          const previousRank = previousRankings.indexOf(athleteInPreviousData) + 1;
          const currentRank = i + 1;

          console.log("cur prev rank", currentRank, previousRank);

          return <div className="rank">
            <div className="athlete">
              #{currentRank} {teamname}
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

    return renderLeaderboard(activities.currentWeek, activities.lastWeek, athletes);
}
