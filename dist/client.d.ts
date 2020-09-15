import { Message } from './message';
export declare const _emit: (topic: string, msg: any) => void;
export declare enum MSG_TYPE {
    READY = "ready",
    MESSAGE = "message",
    GUILD_CREATE = "guildCreate",
    GUILD_DELETE = "guildDelete"
}
interface Token {
    bot_id: string;
    bot_secret: string;
    url: string;
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
}
export {};
