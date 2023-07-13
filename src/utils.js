import moment from 'moment';

export const processRankings = (activities, athletes) => {
    const athletesObj = JSON.parse(JSON.stringify(athletes));
    activities.forEach( activity => {
      const { firstname, lastname } = activity.athlete;
      const name = `${firstname}_${lastname}`;
      athletesObj[name].minutes += Math.round(activity.moving_time / 60);
    })
    const sortedAthletes = Object.entries(athletesObj).sort(([,a],[,b]) => b.minutes-a.minutes);
    return sortedAthletes;
  }

  export const renderRankChange = (currentRank, previousRank) => {
    if(currentRank > previousRank) return <div className="progress down">&#8595;</div>;
    if(currentRank < previousRank) return <div className="progress up">&#8593;</div>;
    return null;
  }

  export const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    const noActivity = !hours && !mins;

    let time = '';
    if(noActivity) time = "No actvity";
    if(hours > 0) time = `${hours} hrs `;
    if(mins > 0) time += `${mins} mins`;
    return time;
  }

  export const mapName = (originalName, mappings) => {
    const mappedName = mappings[originalName];
    return mappedName || originalName;
  }

  export const formatDateByFilename = (fileName) => {
    const rawDate = fileName.replace('.json', '');
    return moment(rawDate, 'YYMMDD').format('DD/MM/YY');
  }