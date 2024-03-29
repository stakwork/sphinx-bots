import MessageEmbed from "./messageEmbed";

export interface Channel {
  id: string;
  send: Function;
  pay: Function;
}

interface Role {
  name: string;
}
export interface Member {
  id?: string;
  nickname?: string;
  roles: Role[];
}

export interface Guild {
  name: string;
}

export interface Author {
  bot: any;
}

export interface Message {
  id?: string;
  reply_id?: string;
  recipient_id?: string;
  content: string;
  channel: Channel;
  member: Member;
  reply?: (content: string) => string;
  amount?: number;
  author?: Author;
  guild?: Guild;
  webhookID?: string;
  embed?: MessageEmbed;
  type?: number;
  media_key?: string;
  media_type?: string;
  muid?: string;
  media_token?: string;
}

export interface Msg {
  id: string;
  reply_id?: string;
  recipient_id?: string;
  content: string;
  channel: Channel;
  member: Member;
  reply: (content: string) => string;
  amount?: number;
  author?: Author;
  guild?: Guild;
  webhookID?: string;
  embed?: MessageEmbed;
  type?: number;
}
