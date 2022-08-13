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
	private commands: BotCommands[] = [
		{
			command: 'sigwx',
			flag: '🇧🇷',
		},
		{
			command: 'sunrise',
			flag: '🇧🇷',
		},
		{
			command: 'rotaer',
			flag: '🇧🇷',
		},
		{
			command: 'metar',
			flag: '🌎',
		},
		{
			command: 'taf',
			flag: '🌎',
		},
		{
			command: 'notam',
			flag: '🇧🇷',
		},
		{
			command: 'atis',
			flag: '🇺🇸',
		},
		{
			command: 'distance',
			flag: '🌎',
		},
	]

	/**
	 * start
	 */
	public async start() {
		await this.bot.start()
	}

	private commandGenerator() {
		for (let i = 0; i < this.commands.length; i++) {
			const e = this.commands[i]

			if (e.command === 'sigwx') {
				this.bot.command('sigwx', async (ctx) => {
					await ctx.reply(`${e.flag} Fetching last SIGWX chart. Standby...`)
					const sigwxURL = await request.sigwx()
					await ctx.replyWithPhoto(sigwxURL)
				})
				continue
			}

			this.bot.command(e.command, async (ctx) => {
				await ctx.reply(`${e.flag} ICAO code`)
				await ctx.conversation.enter(e.command)
			})
		}
	}

	private async atis(conversation: MyConversation, ctx: MyContext) {
		while (true) {
			const { message } = await conversation.wait()
			const icao = message?.text?.toUpperCase() as string

			if (icao.trim() === 'BYE') break
			if (icao && icao.match(/^K[A-Z]{3}/)) {
				ctx.reply(`Looking for ATIS...`)
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

	private async rotaer(conversation: MyConversation, ctx: MyContext) {
		while (true) {
			const { message } = await conversation.wait()
			const icao = message?.text?.toUpperCase() as string

			if (icao === 'BYE') break

			if (icao && icao.match(/^S[A-Z]{3}/)) {
				ctx.reply(`Looking for ROTAER info...`)
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

	private async metar(conversation: MyConversation, ctx: MyContext) {
		while (true) {
			const { message } = await conversation.wait()
			const icao = message?.text?.toUpperCase() as string

			if (icao === 'BYE') break

			if (icao && icao.match(/^[A-Z]{4}/)) {
				ctx.reply(`Looking for METAR...`)
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
				ctx.reply(`Looking for TAF...`)
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

	private async sunrise(conversation: MyConversation, ctx: MyContext) {
		while (true) {
			const { message } = await conversation.wait()
			const icao = message?.text?.toUpperCase() as string

			if (icao === 'BYE') break

			if (icao && icao.match(/^S[A-Z]{3}/)) {
				ctx.reply(`Looking for sunrise/sunset data...`)
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

	private async distance(conversation: MyConversation, ctx: MyContext) {
		while (true) {
			const route = (await conversation.wait()).message?.text as string
			ctx.reply(`Fetching great circle map... Stand by`)

			try {
				if (route && route.toUpperCase().match(/^[A-Z]{4}-[A-Z]{4}$/)) {
					await ctx.replyWithPhoto(request.gc(route))
				}
			} catch (error) {
				await ctx.reply(`Invalid format provided.`)
			} finally {
				await ctx.reply(`Type another ICAO or bye to quit.`)
			}
		}
	}

	private async notam(conversation: MyConversation, ctx: MyContext) {
		while (true) {
			const icao = (await conversation.wait()).message?.text as string
			ctx.reply(`Fetching NOTAM... Stand by`)

			try {
				if (icao && icao.toUpperCase().match(/^S[A-Z]{3}$/)) {
					request.notam(icao)
					await ctx.reply('done')
				}
			} catch (error) {
				console.log(error)
				await ctx.reply(`Invalid format provided.`)
			} finally {
				await ctx.reply(`Type another ICAO or bye to quit.`)
			}
		}
	}

	private setup() {
		this.bot.use(session({ initial: () => ({}) }))
		this.bot.use(conversations())
		this.bot.use(createConversation(this.atis))
		this.bot.use(createConversation(this.rotaer))
		this.bot.use(createConversation(this.metar))
		this.bot.use(createConversation(this.taf))
		this.bot.use(createConversation(this.sunrise))
		this.bot.use(createConversation(this.distance))
		this.bot.use(createConversation(this.notam))
		this.bot.command('start', async (ctx) => {
			await ctx.reply('Hello World!')
		})

		this.commandGenerator()
	}

	constructor() {
		const token = process.env.BOT_TOKEN as string
		if (!token) throw new Error('Token must be provided!')

		this.bot = new Bot(token)
		this.setup()
		this.bot.start()
	}
}
