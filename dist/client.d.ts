import { Message } from './message';
export declare const _emit: (topic: string, msg: any) => void;
export declare enum MSG_TYPE {
    READY = "ready",
    MESSAGE = "message",
    GUILD_CREATE = "guildCreate",
    GUILD_DELETE = "guildDelete"
}
declare type Callback = (message: Message) => void;
export default class Client {
    private token;
    private action;
    private logging;
    login(token: string, action?: Function): Promise<void>;
    log(a: string): void;
    on(msgType: MSG_TYPE, callback: Callback): Promise<void>;
    embedToAction(m: Message): void;
}
export interface Action {
    action: string;
    chatUUID: string;
    botName?: string;
    amount?: number;
    pubkey?: string;
    content?: string;
}
export {};
