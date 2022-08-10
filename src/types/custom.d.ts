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
					flight_category: string
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
