export const weather = {
	metar: (icao: string) =>
		`https://www.aviationweather.gov/adds/dataserver_current/httpparam?datasource=metars&requestType=retrieve&format=xml&mostRecentForEachStation=constraint&hoursBeforeNow=3&stationString=${icao}`,
	taf: (icao: string) =>
		`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=${icao}&hoursBeforeNow=0&timeType=valid`,
}
