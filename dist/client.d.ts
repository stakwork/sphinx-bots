export declare enum MSG_TYPE {
    READY = "ready",
    MESSAGE = "message",
    GUILD_CREATE = "guildCreate",
    GUILD_DELETE = "guildDelete"
}
export default class Client {
    user: {
        [k: string]: any;
    };
    login(token: string): Promise<void>;
    on(msgType: MSG_TYPE, callback: Function): Promise<void>;
}
