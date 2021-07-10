import { processRankings, renderRankChange, formatTime } from "./Leaderboard";
import config from './config';
import { FiUser } from 'react-icons/fi';
import { GiTimeSynchronization } from 'react-icons/gi';
import { IoMdStopwatch } from 'react-icons/io';

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

          const teamSize = config.teams[teamname].length;
          const totalTime = formatTime(minutes);
          const avgTime = formatTime(minutes/teamSize);

          return <div className="rank">
            <div className="athlete">
              #{currentRank} {teamname}
            </div>
            <div className="progress">
              {renderRankChange(currentRank, previousRank)}
            </div>
            <div className="metadata">
              <div>
                <IoMdStopwatch/> {avgTime}
                <span> (avg. time)</span>
              </div>
              <div>
                <GiTimeSynchronization/> {totalTime}
                <span> (total time)</span>
              </div>
              <div>
                <FiUser/> {teamSize} Members
              </div>
            </div>
          </div>
        });
      }

    return renderLeaderboard(activities.currentWeek, activities.lastWeek, athletes);
}
