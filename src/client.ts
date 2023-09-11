import * as EventEmitter from "eventemitter3";
import { Message, Msg, Channel } from "./message";
import fetch from "node-fetch";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as short from "short-uuid";

const EE = new EventEmitter();

export const _emit = function (topic: string, msg: any) {
  EE.emit(topic, msg);
};

export enum MSG_TYPE {
  READY = "ready",
  MESSAGE = "message",
  INSTALL = "install",
  UNINSTALL = "uninstall",
  RESUMED = "resumed",
  GUILD_CREATE = "guildCreate",
  GUILD_DELETE = "guildDelete",
  MESSAGE_CREATE = "message",
  RATE_LIMIT = "rateLimit",
}

type actionType = "broadcast" | "pay";

// const TRIBE_UUID_STRING_LENGTH = 92;

interface Token {
  bot_id: string;
  bot_secret: string;
  url: string;
}

type Callback = (message: Msg) => void;

interface Cache {
  get: (id: string) => Channel;
}
interface Channels {
  cache: Cache;
}

function emptyChan(id: string) {
  return <Channel>{
    id,
    send: function () {},
    pay: function () {},
  };
}

export default class Client {
  private token: string = "";
  private action: Function | null = null; // post to webhook
  private logging: boolean = false;

  public channels = <Channels>{
    cache: <Cache>{
      get: (id: string) => {
        return <Channel>{
          id,
          send: (msg: Message) =>
            this.embedToAction({
              ...msg,
              channel: emptyChan(id),
            }),
          pay: (msg: Message) =>
            this.embedToAction(
              {
                ...msg,
                channel: emptyChan(id),
              },
              "pay"
            ),
        };
      },
    },
  };

  async login(token: string, action?: Function, logging?: boolean) {
    this.token = token;
    if (this.token === "_") {
      this.logging = true;
    } else {
      if (logging) this.logging = true;
      this.startServer();
    }
    if (action) this.action = action;
  }

  log(a: string) {
    if (!this.logging) return;
    console.log(a);
  }

  async on(msgType: MSG_TYPE, callback: Callback) {
    if (!this.token) return;
    EE.on(msgType, (m: Message) => {
      // this.log('===> EE.on received' + msgType + 'CONTENT:' + JSON.stringify(m))
      const channel = <Channel>{
        id: m.channel.id,
        send: (msg: Message) =>
          this.embedToAction({
            ...msg,
            channel: emptyChan(m.channel.id),
          }),
        pay: (msg: Message) =>
          this.embedToAction(
            {
              ...msg,
              channel: emptyChan(m.channel.id),
            },
            "pay"
          ),
      };
      m.channel = channel;
      m.reply = (content: string) => {
        const uuid = short.generate();
        this.embedToAction({
          id: uuid,
          reply_id: m.id,
          content,
          channel,
          member: { roles: [] },
        });
        return uuid;
      };
      callback(m as Msg);
    });
  }

  embedToAction(m: Message, actionType: actionType = "broadcast") {
    let content = "";
    let bot_name = "Bot";
    if (m.embed && m.embed.html) {
      content = m.embed.html;
      bot_name = m.embed.author;
    } else if (typeof m.content === "string") {
      content = m.content;
    }
    const a: Action = {
      msg_uuid: m.id || short.generate(),
      bot_name,
      chat_uuid: m.channel.id,
      reply_uuid: m.reply_id || "",
      content,
      action: actionType,
    };
    if (m.amount) {
      a.amount = m.amount;
    }
    if (m.embed && m.embed.only_owner) {
      a.only_owner = true;
    }
    if (m.embed && m.embed.only_user) {
      a.only_user = m.embed.only_user;
    }
    if (m.embed && m.embed.only_pubkey) {
      a.only_pubkey = m.embed.only_pubkey;
    }
    if (actionType === "pay" && m.recipient_id) {
      a.recipient_id = m.recipient_id;
    }
    if (this.logging) {
      console.log("===>", a);
    }
    if (this.action) {
      this.action(a);
    } else {
      this.doAction(a);
    }
  }

  parseToken() {
    if (!this.token) return;
    const arr = this.token.split(".");
    if (arr.length < 3) return null;
    // 0:id 1:secret 2:url
    const bot_id = Buffer.from(arr[0], "base64").toString("binary");
    const bot_secret = Buffer.from(arr[1], "base64").toString("binary");
    const url = Buffer.from(arr[2], "base64").toString("binary");
    if (!bot_id || !bot_secret || !url) return null;
    return <Token>{
      bot_id,
      bot_secret,
      url,
    };
  }

  async doAction(a: Action) {
    try {
      const t = this.parseToken();
      if (!t) return;
      const { url, bot_id, bot_secret } = t;
      await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          ...a,
          bot_id,
          bot_secret,
        }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.log("doAction error:", e);
    }
  }

  startServer() {
    const t = this.parseToken();
    if (!t) return;
    const { bot_secret } = t;
    const app = express();
    const port = process.env.PORT || 3000;
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(
      cors({
        allowedHeaders: [
          "X-Requested-With",
          "Content-Type",
          "Accept",
          "x-user-token",
          "Authorization",
          "x-secret",
        ],
      })
    );
    app.use(function (req, res, next) {
      var secret = req.headers["x-secret"];
      if (!secret) return res.status(401).send({ error: "Not Authorized" });
      if (secret !== bot_secret)
        return res.status(401).send({ error: "Not Authorized" });
      next();
    });
    app.post("/", (req: express.Request, res: express.Response) => {
      EE.emit(MSG_TYPE.MESSAGE, req.body);
      res.send({ sucess: true });
    });
    app.post("/:route", (req: express.Request, res: express.Response) => {
      const route = req.params.route;
      let ok = "";
      Object.values(MSG_TYPE).forEach((v) => {
        if (v === route) {
          ok = route;
        }
      });
      if (!ok) return res.status(404).send({ error: "Not Found" });
      EE.emit(ok, req.body);
      res.send({ sucess: true });
    });
    app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}`);
    });
  }
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
  recipient_id?: string;
  only_owner?: boolean;
  only_user?: number;
  only_pubkey?: string;
}
