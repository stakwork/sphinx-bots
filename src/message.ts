import MessageEmbed from './messageEmbed'

export interface Channel {
    id: string
    send: Function
}

interface Role {
    name: string
}
export interface Member {
    id?: string
    nickname?: string
    roles: Role[]
}

export interface Guild {
    name: string
}

export interface Author {
    bot: any
}

export interface Message {
    content: string
    channel: Channel
    member: Member
    reply?: Function
    amount?: number
    author?: Author
    guild?: Guild
    webhookID?: string
    embed?: MessageEmbed
    type?: number
}