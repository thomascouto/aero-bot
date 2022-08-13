import PDFDocument from 'pdfkit'

export const createPDF = (notamArr: NOTAMResponseItens[], icao: string) => {
	const doc = new PDFDocument()

	doc.info['Title'] = 'NOTAM'
	doc.info['Author'] = 'Captain BOT from Telegram'
	doc.info['CreationDate'] = new Date()

	doc.text(`NOTAM - ${icao}`, {
		width: 500,
		align: 'center',
	})

	doc.text(new Date().toLocaleDateString(), {
		align: 'center',
	})

	const notamList = {
		AGA: new Array<string>(),
		ATM: new Array<string>(),
		CNS: new Array<string>(),
		OTR: new Array<string>(),
		NAV: new Array<string>(),
	} as NOTAMList

	for (let i = 0; i < notamArr.length; i++) {
		const e = notamArr[i]
		const strNOTAM = `${e.nof} ${e.n} ${e.tp}
Q) ${e.fir}/${e.cod}/${e.traffic}/${e.purpose} /${e.scope} /${e.lower}/${
			e.upper
		}/${e.geo}
A) ${e.loc} - ${e.cidade}/${e.aero}, ${e.uf}
B) ${e.b} - C) ${e.c} ${e.d.length > 0 ? `\nD) ${e.d}` : ''}
E) ${e.e} ${e.f.length > 0 ? `\nF) ${e.f}` : ''} ${
			e.g.length > 0 ? `\nG) ${e.g}` : ''
		}
DT EXPED: ${e.dt}
STATUS: ${e.status}
ORIGEM: ${e.origem}\n\n`
		notamList[e.cat].push(strNOTAM)
	}

	doc.font('Courier').text(notamList.AGA.join(''))
	doc.font('Courier').text(notamList.ATM.join(''))
	doc.font('Courier').text(notamList.CNS.join(''))
	doc.font('Courier').text(notamList.NAV.join(''))
	doc.font('Courier').text(notamList.OTR.join(''))

	doc.end()
}
