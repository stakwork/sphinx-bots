import * as EventEmitter from 'eventemitter3'
import { Message, Channel } from './message'

const EE = new EventEmitter()

export const _emit = function(topic:string, msg:any) {
    EE.emit(topic, msg)
}

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
            this.log('===> EE.on received' + msgType + 'CONTENT:' + JSON.stringify(m))
            const channel = <Channel>{
                id: m.channel.id,
                send: (msg: Message) => this.embedToAction({...msg,channel:{id:m.channel.id,send:function(){}}})
            }
            m.channel = channel
            m.reply = function (content:string) {
                this.embedToAction({content, channel})
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
        } else if (typeof m.content === 'string') {
            content = m.content
        }
        this.action(<Action>{
            botName, chatUUID: m.channel.id,
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
