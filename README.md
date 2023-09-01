1. npm run start
2. Go to localhost:3000, authorise and copy response
3. Create new file in /data with response
4. Take screenshot


Todo:
- modify script to ignore anything after thurs 12am and auto update title
- Handle manually logged activities
- Remove duplicate activities found in current and last data set function
- Auto create data file
- Script to generate slack message (elimations, at risk, fallen heroes, come backs, solo and team rankings lists)



Handling new members:
- Find how many minutes they've spent in the current week via Strava
- Add all of their activities into last weeks data (due to strava limitations, it's all data from their strava, not just this weeks)
- Create a new activity entry in the current week's JSON and set the moving time to the total amount of seconds they've worked out form step 1
