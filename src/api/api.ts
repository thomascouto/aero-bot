import axios from 'axios'
import { aisweb, datis, weather, gc } from './data'
import { parseRequest } from './parser'
import { createPDF } from './pdf'

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
			return parseRequest.metar(data).response.data.METAR[0].raw_text
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
			return `⌚ UTC - 3

🌅 ${sunrise === 'ND' ? 'N/A' : sunrise}
🌇 ${sunset === 'ND' ? 'N/A' : sunset}`
		}
		throw new Error(`Internal server error. ${status}`)
	},

	notam: async (icao: string): Promise<void> => {
		const { data, status } = await axios.get(aisweb.notam(icao))

		if (status === 200) {
			const notamArr = parseRequest.notam(data).aisweb.notam.item
			const pdfDocument = createPDF(notamArr, icao)
		}
	},

	gc: (icaoCodes: string): string => {
		return gc(icaoCodes)
	},
}

// export const paginate = (pageSize: number, pageNumber: number) => {
// 	return datis.airdromes.slice(
// 		(pageNumber - 1) * pageSize,
// 		pageNumber * pageSize
// 	)
// }

export { request }
