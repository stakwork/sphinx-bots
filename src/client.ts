import * as EventEmitter from 'eventemitter3'
import { Message, Channel } from './message'
import fetch from 'node-fetch'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

const EE = new EventEmitter()

export const _emit = function (topic: string, msg: any) {
    EE.emit(topic, msg)
}

export enum MSG_TYPE {
    READY = 'ready',
    MESSAGE = 'message',
    GUILD_CREATE = 'guildCreate',
    GUILD_DELETE = 'guildDelete',
}

interface Token {
    bot_id: string
    bot_secret: string
    url: string
}

type Callback = (message: Message) => void;

export default class Client {

    private token: string = ''
    private action: Function | null = null // post to webhook
    private logging: boolean = false

    async login(token: string, action?: Function) {
        this.token = token
        if (this.token === '_') {
            this.logging = true
        } else {
            this.startServer()
        }
        if (action) this.action = action
    }

    log(a: string) {
        if (!this.logging) return
        console.log(a)
    }

    async on(msgType: MSG_TYPE, callback: Callback) {
        if (!this.token) return
        EE.on(msgType, m => {
            this.log('===> EE.on received' + msgType + 'CONTENT:' + JSON.stringify(m))
            const channel = <Channel>{
                id: m.channel.id,
                send: (msg: Message) => this.embedToAction({
                    ...msg,
                    channel: { id: m.channel.id, send: function () { } }
                })
            }
            m.channel = channel
            m.reply = (content: string) => {
                this.embedToAction({ content, channel })
            }
            callback(m)
        })
    }

    embedToAction(m: Message) {
        let content = ''
        let bot_name = 'Bot'
        if (m.embed && m.embed.html) {
            content = m.embed.html
            bot_name = m.embed.author
        } else if (typeof m.content === 'string') {
            content = m.content
        }
        // console.log(<Action>{
        //     botName, chatUUID: m.channel.id,
        //     content, action: 'broadcast',
        // })
        const a: Action = {
            bot_name, chat_uuid: m.channel.id,
            content, action: 'broadcast',
        }
        if (this.action) {
            this.action(a)
        } else {
            this.doAction(a)
        }
    }

    parseToken() {
        if (!this.token) return
        const arr = this.token.split('.')
        if (arr.length < 3) return null        
        // 0:id 1:secret 2:url
        const bot_id = Buffer.from(arr[0], 'base64').toString('binary')
        const bot_secret = Buffer.from(arr[1], 'base64').toString('binary')
        const url = Buffer.from(arr[2], 'base64').toString('binary')
        if(!bot_id||!bot_secret||!url) return null
        return <Token>{
            bot_id, bot_secret, url
        }
    }

    async doAction(a: Action) {
        try {
            const t = this.parseToken()
            if(!t) return
            const {url,bot_id,bot_secret} = t
            await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    ...a, bot_id, bot_secret
                }),
                headers: { 'Content-Type': 'application/json' }
            })
        } catch (e) {
            console.log('doAction error:', e)
        }
    }

    startServer(){
        const t = this.parseToken()
        if(!t) return
        const {bot_secret} = t
        const app = express()
        const port = process.env.PORT || 3000
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cors({
            allowedHeaders:['X-Requested-With','Content-Type','Accept','x-user-token','Authorization','x-secret']
        }))
        app.post('/', (req: express.Request, res: express.Response) => {
            var secret = req.headers['x-secret'];
            if(secret!==bot_secret) {
                return res.send({error:'no secret provided'})
            }
            EE.emit(MSG_TYPE.MESSAGE, req.body)
            res.send({sucess:true})
        })
        app.listen(port, () => {
            console.log(`Listening at http://localhost:${port}`)
        })
    }

}

export interface Action {
    action: string
    chat_uuid: string
    bot_name?: string
    amount?: number
    pubkey?: string
    content?: string
}
