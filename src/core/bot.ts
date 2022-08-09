/* eslint-disable no-constant-condition */
import { Bot, Context, session } from 'grammy'
import {
	type Conversation,
	type ConversationFlavor,
	conversations,
	createConversation,
} from '@grammyjs/conversations'
import { request } from '../api/api'

type MyContext = Context & ConversationFlavor
type MyConversation = Conversation<MyContext>

export class CaptainBot {
	private bot: Bot<MyContext>

	/**
	 * start
	 */
	public async start() {
		await this.bot.start()
	}

	private async atis(conversation: MyConversation, ctx: MyContext) {
		while (true) {
			const { message } = await conversation.wait()
			const icao = message?.text?.toUpperCase() as string

			if (icao.trim() === 'BYE') break
			if (icao && icao.match(/^K[A-Z]{3}/)) {
				ctx.reply(`Looking for ${icao} ATIS...`)
				try {
					const response = await request.atis(icao)
					if (response.length === 2) {
						await ctx.reply(`1 - Arrival
2 - Departure
3 - Both`)
						const atisOption = await conversation.wait()
						switch (atisOption.message?.text?.trim()) {
							case '1':
								await ctx.reply(response[0].datis)
								break
							case '2':
								await ctx.reply(response[1].datis)
								break
							case '3':
								await ctx.reply(response[0].datis)
								await ctx.reply(response[1].datis)
								break

							default:
								await ctx.reply('Invalid option.')
						}
					} else {
						await ctx.reply(response[0].datis)
					}
				} catch (error) {
					await ctx.reply(`No ATIS found for ${icao}.`)
				} finally {
					await ctx.reply(`Type another ICAO or bye to quit.`)
				}
			} else {
				await ctx.reply(`${icao} is not a valid 🇺🇸 airport.`)
			}
		}
		await ctx.reply('Bye! ✈️')
		return
	}

	private atisCommand() {
		this.bot.command('atis', async (ctx) => {
			await ctx.reply('🇺🇸 ICAO code')
			await ctx.conversation.enter('atis')
		})
	}

	private async rotaer(conversation: MyConversation, ctx: MyContext) {
		while (true) {
			const { message } = await conversation.wait()
			const icao = message?.text?.toUpperCase() as string

			if (icao === 'BYE') break

			if (icao && icao.match(/^S[A-Z]{3}/)) {
				ctx.reply(`Looking for ${icao} ROTAER...`)
				try {
					const response = await request.rotaer(icao)

					await ctx.reply(response[0])
					await ctx.reply(response[1])
					await ctx.reply(response[2])
				} catch (error) {
					await ctx.reply(`No ROTAER found for ${icao}.`)
				} finally {
					await ctx.reply(`Type another ICAO or bye to quit.`)
				}
			} else {
				await ctx.reply(`${icao} is not a valid 🇧🇷 airport.`)
			}
		}
		await ctx.reply('Bye! ✈️')
		return
	}

	private rotaerCommand() {
		this.bot.command('rotaer', async (ctx) => {
			await ctx.reply('🇧🇷 ICAO code')
			await ctx.conversation.enter('rotaer')
		})
	}

	private sigwxCommand() {
		this.bot.command('sigwx', async (ctx) => {
			await ctx.reply('🇧🇷 Fetching last SIGWX chart. Standby...')
			const sigwxURL = await request.sigwx()
			await ctx.replyWithPhoto(sigwxURL)
		})
	}

	private async metar(conversation: MyConversation, ctx: MyContext) {
		while (true) {
			const { message } = await conversation.wait()
			const icao = message?.text?.toUpperCase() as string

			if (icao === 'BYE') break

			if (icao && icao.match(/^[A-Z]{4}/)) {
				ctx.reply(`Looking for ${icao} METAR...`)
				try {
					const response = await request.metar(icao)
					await ctx.reply(response)
				} catch (error) {
					await ctx.reply(`No METAR found for ${icao}.`)
				} finally {
					await ctx.reply(`Type another ICAO or bye to quit.`)
				}
			} else {
				await ctx.reply(`${icao} is not a valid ICAO code.`)
			}
		}
		await ctx.reply('Bye! ✈️')
		return
	}

	private async taf(conversation: MyConversation, ctx: MyContext) {
		while (true) {
			const { message } = await conversation.wait()
			const icao = message?.text?.toUpperCase() as string

			if (icao === 'BYE') break

			if (icao && icao.match(/^[A-Z]{4}/)) {
				ctx.reply(`Looking for ${icao} TAF...`)
				try {
					const response = await request.taf(icao)
					await ctx.reply(response)
				} catch (error) {
					console.log(error)

					await ctx.reply(`No TAF found for ${icao}.`)
				} finally {
					await ctx.reply(`Type another ICAO or bye to quit.`)
				}
			} else {
				await ctx.reply(`${icao} is not a valid ICAO code.`)
			}
		}
		await ctx.reply('Bye! ✈️')
		return
	}
	private async srss(conversation: MyConversation, ctx: MyContext) {
		while (true) {
			const { message } = await conversation.wait()
			const icao = message?.text?.toUpperCase() as string

			if (icao === 'BYE') break

			if (icao && icao.match(/^S[A-Z]{3}/)) {
				ctx.reply(`Looking for ${icao} sunrise/sunset data...`)
				try {
					const response = await request.srss(icao)
					await ctx.reply(response)
				} catch (error) {
					console.log(error)

					await ctx.reply(`No sunrise/sunset data found for ${icao}.`)
				} finally {
					await ctx.reply(`Type another ICAO or bye to quit.`)
				}
			} else {
				await ctx.reply(`${icao} is not a valid ICAO code.`)
			}
		}
		await ctx.reply('Bye! ✈️')
		return
	}

	private metarCommand() {
		this.bot.command('metar', async (ctx) => {
			await ctx.reply('🌎 ICAO code')
			await ctx.conversation.enter('metar')
		})
	}
	private tafCommand() {
		this.bot.command('taf', async (ctx) => {
			await ctx.reply('🌎 ICAO code')
			await ctx.conversation.enter('taf')
		})
	}

	private srssCommand() {
		this.bot.command('sunrise', async (ctx) => {
			await ctx.reply('🇧🇷 ICAO code')
			await ctx.conversation.enter('srss')
		})
	}

	private setup() {
		this.bot.use(session({ initial: () => ({}) }))
		this.bot.use(conversations())
		this.bot.use(createConversation(this.atis))
		this.bot.use(createConversation(this.rotaer))
		this.bot.use(createConversation(this.metar))
		this.bot.use(createConversation(this.taf))
		this.bot.use(createConversation(this.srss))
		this.bot.command('start', async (ctx) => {
			await ctx.reply('Hello World!')
		})

		this.atisCommand()
		this.rotaerCommand()
		this.sigwxCommand()
		this.metarCommand()
		this.tafCommand()
		this.srssCommand()
	}

	constructor() {
		const token = process.env.BOT_TOKEN as string
		if (!token) throw new Error('Token must be provided!')

		this.bot = new Bot(token)
		this.setup()
		this.bot.start()
	}
}
