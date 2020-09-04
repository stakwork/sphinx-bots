import MessageEmbed from './messageEmbed'

export interface Channel {
    id: string
    send: Function
}

export interface Member {
    id: string
    nickname: string
}

export interface Guild {
    name: string
}

export interface Author {
    bot: any
}

export interface Message {
    content: string
    author: Author
    member: Member
    guild: Guild
    webhookID: string
    reply: Function
    channel: Channel
    embed: MessageEmbed
}