import * as EventEmitter from 'eventemitter3'
import { Message, Channel } from './message'
import fetch from 'node-fetch'

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
        if (this.token === '_') {
            this.logging = true
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
            // this.log('===> EE.on received' + msgType + 'CONTENT:' + JSON.stringify(m))
            const channel = <Channel>{
                id: m.channel.id,
                send: (msg: Message) => this.embedToAction({
                    ...msg,
                    channel:{id:m.channel.id,send:function(){}}
                })
            }
            m.channel = channel
            m.reply = (content:string) => {
                this.embedToAction({content, channel, reply:function(){}})
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
        // console.log(<Action>{
        //     botName, chatUUID: m.channel.id,
        //     content, action: 'broadcast',
        // })
        const a:Action = {
            botName, chatUUID: m.channel.id,
            content, action: 'broadcast',
        }
        if(this.action) {
            this.action(a)
        } else {
            this.doAction(a)
        }
    }

    async doAction(a: Action) {
        try {
            const params = Buffer.from(this.token, 'base64').toString('binary')
            const arr = params.split('::')
            if(arr.length<3) return // 0:id 1:secret 2:url
            const bot_id = arr[0]
            const bot_secret = arr[1]
            const url = arr[2]
            await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    ...a, bot_id, bot_secret
                }),
                headers: {'Content-Type': 'application/json'}
            })
        } catch(e) {
            console.log('doAction error:',e)
        }
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
