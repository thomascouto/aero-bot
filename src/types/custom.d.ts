type AtisResponse = {
	airport: string
	type: 'arr' | 'dep' | 'combined'
	datis: string
}

type AtisResponseError = {
	error: string
}
type InlineKeyboardType = { text: string; callback_data: string }

type SRSSResponse = {
	aisweb: {
		day: {
			sunrise: string
			sunset: string
		}
	}
}

type RotaerResponse = {
	aisweb: {
		AeroCode: string
		name: string
		city: string
		uf: string
		latRotaer: string
		lngRotaer: string
		type: string
		org: { name: string }
		typeUtil: string
		typeOpr: string
		cat: string
		fir: string
		utc: string
		distance: string
		jur: string
		altM: number
		altFt: number
		lights: { light: [string] }
		runways: {
			runway: [
				{
					type: string
					ident: string
					surface: string
					length: number
					width: number
					surface_c: string
				}
			]
		}
		services: { service: Array }
		rmk: { rmkText: [string] }
		rmkDistDeclared: {
			rmkDist: [
				{
					rwy: string
					tora: number
					toda: number
					asda: number
					lda: number
				}
			]
		}
		compls: { compl: [string] }
	}
}

type RotaerResponseError = {
	error: string
}

type MetarResponse = {
	response: {
		data: {
			METAR: [
				{
					raw_text: string
				}
			]
		}
	}
}
type TafResponse = {
	response: {
		data: {
			TAF: [
				{
					raw_text: string
				}
			]
		}
	}
}

type BotCommands = {
	command: string
	flag: '🇧🇷' | '🌎' | '🇺🇸'
}

// eslint-disable-next-line @typescript-eslint/ban-types
type NOTAMResponse = {
	aisweb: {
		notam: {
			item: [NOTAMResponseItens]
		}
	}
}

type NOTAMResponseItens = {
	id: string
	cod: string
	status: string
	cat: 'AGA' | 'NAV' | 'ATM' | 'CNS' | 'OTR'
	dist: string
	tp: string
	dt: string
	n: string
	number: string
	ref: string
	ref_id: string
	ref_s: string
	loc: string
	b: string
	c: string
	d: string
	e: string
	f: string
	g: string
	nof: string
	s: string
	geo: string
	geo_url: string
	aero: string
	cidade: string
	uf: string
	origem: string
	fir: string
	year: string
	traffic: string
	lower: string
	upper: string
	state: string
	seqnumber: string
	purpose: string
	scope: string
}

type NOTAMList = {
	AGA: string[]
	NAV: string[]
	ATM: string[]
	CNS: string[]
	OTR: string[]
}
