import axios from 'axios'
import { parseRequest } from './parser'

const datis = {
	url: 'https://datis.clowd.io/api/',
	airdromes: [
		{ text: 'KABQ', callback_data: 'KABQ' },
		{ text: 'KADW', callback_data: 'KADW' },
		{ text: 'KALB', callback_data: 'KALB' },
		{ text: 'KATL', callback_data: 'KATL' },
		{ text: 'KAUS', callback_data: 'KAUS' },
		{ text: 'KBDL', callback_data: 'KBDL' },
		{ text: 'KBNA', callback_data: 'KBNA' },
		{ text: 'KBOI', callback_data: 'KBOI' },
		{ text: 'KBOS', callback_data: 'KBOS' },
		{ text: 'KBUF', callback_data: 'KBUF' },
		{ text: 'KBUR', callback_data: 'KBUR' },
		{ text: 'KBWI', callback_data: 'KBWI' },
		{ text: 'KCHS', callback_data: 'KCHS' },
		{ text: 'KCLE', callback_data: 'KCLE' },
		{ text: 'KCLT', callback_data: 'KCLT' },
		{ text: 'KCMH', callback_data: 'KCMH' },
		{ text: 'KCVG', callback_data: 'KCVG' },
		{ text: 'KDAL', callback_data: 'KDAL' },
		{ text: 'KDCA', callback_data: 'KDCA' },
		{ text: 'KDEN', callback_data: 'KDEN' },
		{ text: 'KDFW', callback_data: 'KDFW' },
		{ text: 'KDTW', callback_data: 'KDTW' },
		{ text: 'KELP', callback_data: 'KELP' },
		{ text: 'KEWR', callback_data: 'KEWR' },
		{ text: 'KFLL', callback_data: 'KFLL' },
		{ text: 'KGSO', callback_data: 'KGSO' },
		{ text: 'KHOU', callback_data: 'KHOU' },
		{ text: 'KHPN', callback_data: 'KHPN' },
		{ text: 'KIAD', callback_data: 'KIAD' },
		{ text: 'KIAH', callback_data: 'KIAH' },
		{ text: 'KIND', callback_data: 'KIND' },
		{ text: 'KJAX', callback_data: 'KJAX' },
		{ text: 'KJFK', callback_data: 'KJFK' },
		{ text: 'KLAS', callback_data: 'KLAS' },
		{ text: 'KLAX', callback_data: 'KLAX' },
		{ text: 'KLGA', callback_data: 'KLGA' },
		{ text: 'KLIT', callback_data: 'KLIT' },
		{ text: 'KMCI', callback_data: 'KMCI' },
		{ text: 'KMCO', callback_data: 'KMCO' },
		{ text: 'KMDW', callback_data: 'KMDW' },
		{ text: 'KMEM', callback_data: 'KMEM' },
		{ text: 'KMIA', callback_data: 'KMIA' },
		{ text: 'KMKE', callback_data: 'KMKE' },
		{ text: 'KMSP', callback_data: 'KMSP' },
		{ text: 'KMSY', callback_data: 'KMSY' },
		{ text: 'KOAK', callback_data: 'KOAK' },
		{ text: 'KOKC', callback_data: 'KOKC' },
		{ text: 'KOMA', callback_data: 'KOMA' },
		{ text: 'KONT', callback_data: 'KONT' },
		{ text: 'KORD', callback_data: 'KORD' },
		{ text: 'KPBI', callback_data: 'KPBI' },
		{ text: 'KPDX', callback_data: 'KPDX' },
		{ text: 'KPHL', callback_data: 'KPHL' },
		{ text: 'KPHX', callback_data: 'KPHX' },
		{ text: 'KPIT', callback_data: 'KPIT' },
		{ text: 'KPVD', callback_data: 'KPVD' },
		{ text: 'KRDU', callback_data: 'KRDU' },
		{ text: 'KRNO', callback_data: 'KRNO' },
		{ text: 'KRSW', callback_data: 'KRSW' },
		{ text: 'KSAN', callback_data: 'KSAN' },
		{ text: 'KSAT', callback_data: 'KSAT' },
		{ text: 'KSDF', callback_data: 'KSDF' },
		{ text: 'KSEA', callback_data: 'KSEA' },
		{ text: 'KSFO', callback_data: 'KSFO' },
		{ text: 'KSJC', callback_data: 'KSJC' },
		{ text: 'KSLC', callback_data: 'KSLC' },
		{ text: 'KSMF', callback_data: 'KSMF' },
		{ text: 'KSNA', callback_data: 'KSNA' },
		{ text: 'KSTL', callback_data: 'KSTL' },
		{ text: 'KTEB', callback_data: 'KTEB' },
		{ text: 'KTPA', callback_data: 'KTPA' },
		{ text: 'KTUL', callback_data: 'KTUL' },
		{ text: 'KVNY', callback_data: 'KVNY' },
		{ text: 'PANC', callback_data: 'PANC' },
		{ text: 'PHNL', callback_data: 'PHNL' },
		{ text: 'TJSJ', callback_data: 'TJSJ' },
	] as InlineKeyboardType[],
}

const aisweb = {
	url: `https://api.decea.mil.br/aisweb/?apiKey=${process.env.AIS_WEB_USER}&apiPass=${process.env.AIS_WEB_PASS}&area=`,
	rotaer: (icao: string) => aisweb.url.concat(`rotaer&icaoCode=${icao}`),
	sigwx: `https://api-redemet.decea.mil.br/produtos/sigwx?api_key=${process.env.REDEMET_TOKEN}`,
	srss: (icao: string) => {
		const date = new Date().toISOString().split('T')[0]
		return aisweb.url.concat(
			`&area=sol&icaoCode=${icao}&dt_i=${date}&dt_f=${date}`
		)
	},
}

const weather = {
	metar: (icao: string) =>
		`https://www.aviationweather.gov/adds/dataserver_current/httpparam?datasource=metars&requestType=retrieve&format=xml&mostRecentForEachStation=constraint&hoursBeforeNow=3&stationString=${icao}`,
	taf: (icao: string) =>
		`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=${icao}&hoursBeforeNow=0&timeType=valid`,
}

const request = {
	atis: async (icao: string): Promise<AtisResponse[]> => {
		const { data, status } = await axios.get<
			AtisResponse[] | AtisResponseError
		>(datis.url.concat(icao))

		if (status === 200) {
			if ((data as AtisResponseError).error) {
				throw new Error(`ATIS for ${icao} not found.`)
			}
			return data as AtisResponse[]
		}

		throw new Error('Internal server error. Try again later')
	},

	rotaer: async (icao: string): Promise<string[]> => {
		const { data, status } = await axios.get(aisweb.rotaer(icao))

		if (status === 200) {
			const parsed = parseRequest.rotaer(data)

			if ((parsed as RotaerResponseError).error) {
				throw new Error(`ROTAER for ${icao} not found.`)
			}
			const {
				AeroCode,
				altFt,
				altM,
				cat,
				city,
				fir,
				jur,
				latRotaer,
				lights,
				lngRotaer,
				distance,
				name,
				org,
				rmkDistDeclared,
				runways,
				type,
				typeOpr,
				typeUtil,
				uf,
				utc,
			} = (parsed as RotaerResponse).aisweb

			const response: string[] = []

			response.push(`${name} (${AeroCode}) / ${city}, ${uf}
${fir} ${jur}
${latRotaer}/${lngRotaer} ${altM}m (${altFt}ft)`)
			response.push(
				`${type} ${cat} ${typeUtil} ${
					org.name
				} ${distance} UTC${utc} ${typeOpr} ${lights.light.toString()}`
			)
			runways.runway.forEach((e) => {
				response.push(
					`${e.type} ${e.ident} ${e.length}x${e.width} ${e.surface} ${e.surface_c}`
				)
			})
			if (rmkDistDeclared) {
				let rmkDist = ''
				rmkDistDeclared.rmkDist.forEach((e) => {
					rmkDist = rmkDist.concat(
						`RWY ${e.rwy} ${e.tora} ${e.toda} ${e.asda} ${e.lda}\n`
					)
				})

				response[2] = response[2].concat(`\n${rmkDist}`)
			}

			return response
		}
		throw new Error('Internal server error.')
	},

	sigwx: async (): Promise<string> => {
		const { data, status } = await axios.get<string>(aisweb.sigwx)
		if (status === 200) return data
		throw new Error('SIGWX chart not available.')
	},

	metar: async (icao: string): Promise<string> => {
		const { data, status } = await axios.get(weather.metar(icao))

		if (status === 200) {
			const parsed = parseRequest.metar(data).response.data.METAR
			return `[${parsed[0].flight_category}] ${parsed[0].raw_text}`
		}
		throw new Error(`Internal server error. ${status}`)
	},

	taf: async (icao: string): Promise<string> => {
		const { data, status } = await axios.get(weather.taf(icao))

		if (status === 200) {
			return parseRequest.taf(data).response.data.TAF[0].raw_text
		}
		throw new Error(`Internal server error. ${status}`)
	},

	srss: async (icao: string): Promise<string> => {
		const { data, status } = await axios.get(aisweb.srss(icao))

		if (status === 200) {
			const { sunrise, sunset } = parseRequest.srss(data).aisweb.day
			return `⌚ UTC
🌅 ${sunrise === 'ND' ? 'N/A' : sunrise}
🌇 ${sunset === 'ND' ? 'N/A' : sunset}`
		}
		throw new Error(`Internal server error. ${status}`)
	},
}

// export const paginate = (pageSize: number, pageNumber: number) => {
// 	return datis.airdromes.slice(
// 		(pageNumber - 1) * pageSize,
// 		pageNumber * pageSize
// 	)
// }

export { request }
