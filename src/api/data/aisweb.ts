export const aisweb = {
	url: `https://api.decea.mil.br/aisweb/?apiKey=${process.env.AIS_WEB_USER}&apiPass=${process.env.AIS_WEB_PASS}&area=`,
	rotaer: (icao: string) => aisweb.url.concat(`rotaer&icaoCode=${icao}`),
	sigwx: `https://api-redemet.decea.mil.br/produtos/sigwx?api_key=${process.env.REDEMET_TOKEN}`,
	srss: (icao: string) => {
		const date = new Date().toISOString().split('T')[0]
		return aisweb.url.concat(
			`&area=sol&icaoCode=${icao}&dt_i=${date}&dt_f=${date}`
		)
	},
	notam: (icao: string) => {
		return aisweb.url.concat(`notam&IcaoCode=${icao}`)
	},
}
