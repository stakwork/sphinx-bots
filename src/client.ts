import * as EventEmitter from 'eventemitter3'
import { Message, Channel } from './message'

const EE = new EventEmitter()

export const _emit = EE.emit

export enum MSG_TYPE {
    READY = 'ready',
    MESSAGE = 'message',
    GUILD_CREATE = 'guildCreate',
    GUILD_DELETE = 'guildDelete',
}

type Callback = (message: Message) => void;

export default class Client {

    private token: string = ''
    private action: Function = function () { } // post to webhook
    private logging: boolean = false

    async login(token: string, action?: Function) {
        this.token = token
        if (this.token === '_') this.logging = true
        if (action) this.action = action
    }

    log(a: string) {
        if (!this.logging) return
        console.log(a)
    }

    async on(msgType: MSG_TYPE, callback: Callback) {
        if (!this.token) return
        EE.on(msgType, m => {
            this.log('===> EE.on received' + msgType + 'CONTENT:' + m.content)
            m.channel = <Channel>{
                id: '_',
                send: (msg: Message) => this.embedToAction({ ...msg, chatUUID: m.chatUUID })
            }
            m.reply = function (content:string) {
                this.embedToAction({content, chatUUID: m.chatUUID})
            }
            callback(m)
        })
    }

    embedToAction(m: Message) {
        let content = ''
        let botName = 'Bot'
        if (m.embed && m.embed.html) {
            content = m.embed.html
            botName = m.embed.author
        } else if (typeof m === 'string') {
            content = m
        }
        this.log('==> action to send from lib:' + JSON.stringify({
            botName, chatUUID: m.chatUUID,
            content, action: 'broadcast',
        }))
        this.action(<Action>{
            botName, chatUUID: m.chatUUID,
            content, action: 'broadcast',
        })
    }

}

export interface Action {
    action: string
    chatUUID: string
    botName?: string
    amount?: number
    pubkey?: string
    content?: string
}
