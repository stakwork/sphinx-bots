import { Message, Msg, Channel } from "./message";
export declare const _emit: (topic: string, msg: any) => void;
export declare enum MSG_TYPE {
    READY = "ready",
    MESSAGE = "message",
    INSTALL = "install",
    UNINSTALL = "uninstall",
    RESUMED = "resumed",
    GUILD_CREATE = "guildCreate",
    GUILD_DELETE = "guildDelete",
    MESSAGE_CREATE = "message",
    RATE_LIMIT = "rateLimit"
}
interface Token {
    bot_id: string;
    bot_secret: string;
    url: string;
}
declare type Callback = (message: Msg) => void;
interface Cache {
    get: (id: string) => Channel | null;
}
interface Channels {
    cache: Cache;
}
export default class Client {
    private token;
    private action;
    private logging;
    channels: Channels;
    login(token: string, action?: Function, logging?: boolean): Promise<void>;
    log(a: string): void;
    on(msgType: MSG_TYPE, callback: Callback): Promise<void>;
    embedToAction(m: Message): void;
    parseToken(): Token | null | undefined;
    doAction(a: Action): Promise<void>;
    startServer(): void;
}
export interface Action {
    action: string;
    chat_uuid: string;
    bot_name?: string;
    amount?: number;
    pubkey?: string;
    content?: string;
    msg_uuid: string;
    reply_uuid?: string;
}
export {};
