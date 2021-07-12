import { processRankings, renderRankChange, formatTime } from "./utils";
import { FiUser } from 'react-icons/fi';
import { GiTimeSynchronization } from 'react-icons/gi';
import { IoMdStopwatch } from 'react-icons/io';

export default function TeamsLeaderboard({athletes, activities}) {

    const groupIntoTeams = (rankings) => {
        const teams = {};
        rankings.forEach( ([, info]) => {
            const { minutes, team } = info;
            const activeTeamSize = getActiveTeamMembers(rankings, team).length;
            teams[team] = teams[team] || { avgTime: 0, totalTime: 0, activeMembers: 0 };
            teams[team].totalTime += minutes;
            teams[team].avgTime += minutes/activeTeamSize;
            teams[team].activeMembers = activeTeamSize;
        })
        const sortedTeams = Object.entries(teams).sort(([,a],[,b]) => b.avgTime-a.avgTime);
        return sortedTeams;
    }

    const getActiveTeamMembers = (currentRankings, teamName) => {
      return currentRankings.filter( ([,member]) => {
        const belongsToTeam = member.team === teamName;
        const isActive = member.minutes > 0;
        return belongsToTeam && isActive;
      })
    }

    const renderLeaderboard = (currentWeekActivities, lastWeekActivities, athletes) => {
        const ungroupedRankings = processRankings(currentWeekActivities, athletes);
        const currentRankings = groupIntoTeams(ungroupedRankings);
        const previousRankings = groupIntoTeams(processRankings(lastWeekActivities, athletes));

        return currentRankings.map( ([teamname, info], i) => {

          const athleteInPreviousData = previousRankings.find(([name]) => teamname === name);
          const previousRank = previousRankings.indexOf(athleteInPreviousData) + 1;
          const currentRank = i + 1;

          const { totalTime, avgTime, activeMembers } = info;

          return <div className="rank">
            <div className="athlete">
              #{currentRank} {teamname}
            </div>
            <div className="progress">
              {renderRankChange(currentRank, previousRank)}
            </div>
            <div className="metadata">
              <div>
                <IoMdStopwatch/> {formatTime(avgTime)}
                <span> (avg. time)</span>
              </div>
              <div>
                <GiTimeSynchronization/> {formatTime(totalTime)}
                <span> (total time)</span>
              </div>
              <div>
                <FiUser/> {activeMembers}
                <span> (active {activeMembers > 1 ? ' members' : ' member'})</span>
              </div>
            </div>
          </div>
        });
      }

    return renderLeaderboard(activities.currentWeek, activities.lastWeek, athletes);
}
