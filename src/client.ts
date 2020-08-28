import * as EventEmitter from 'eventemitter3'

const EE = new EventEmitter()

export enum MSG_TYPE {
    READY = 'ready',
    MESSAGE = 'message',
    GUILD_CREATE = 'guildCreate',
    GUILD_DELETE = 'guildDelete',
}

export default class Client {

    user: {[k:string]:any} = {} // ?
    private token: string = ''

    async login(token:string) {
        this.token = token
    }

    async on(msgType:MSG_TYPE, callback:Function) {
        if(!this.token) return
        EE.on(msgType, function(){
            callback()
        })
    }

}
