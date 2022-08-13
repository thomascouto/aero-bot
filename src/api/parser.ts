import { X2jOptions, XMLParser } from 'fast-xml-parser'

const alwaysArrayNotam = ['aisweb.notam.item']
const alwaysArrayMetar = ['response.data.METAR']
const alwaysArrayTaf = ['response.data.TAF']
const alwaysArrayRotaer = [
	'aisweb.lights.light',
	'aisweb.runways.runway',
	'aisweb.services.service',
	'aisweb.rmkDistDeclared.rmkDist',
]

const generateOptions = (arr: string[]): X2jOptions =>
	({
		ignoreDeclaration: true,
		ignoreAttributes: true,
		attributeNamePrefix: '@_',
		isArray: (name, jpath, isLeafNode, isAttribute) => {
			if (arr.indexOf(jpath) !== -1) return true
		},
	} as X2jOptions)

export const parseRequest = {
	rotaer: (icao: string): RotaerResponse | RotaerResponseError => {
		return new XMLParser(generateOptions(alwaysArrayRotaer)).parse(icao)
	},

	metar: (icao: string): MetarResponse => {
		return new XMLParser(generateOptions(alwaysArrayMetar)).parse(icao)
	},

	taf: (icao: string): TafResponse => {
		return new XMLParser(generateOptions(alwaysArrayTaf)).parse(icao)
	},

	srss: (icao: string): SRSSResponse => {
		return new XMLParser().parse(icao)
	},

	notam: (icao: string): NOTAMResponse => {
		return new XMLParser(generateOptions(alwaysArrayNotam)).parse(icao)
	},
}
