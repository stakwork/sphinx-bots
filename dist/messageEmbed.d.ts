export interface Embed {
    author: string;
    color: string;
    description: string;
    thumbnail: string;
}
export default class MessageEmbed {
    embed: Embed;
    setAuthor(author: string): Promise<void>;
    setColor(color: any): Promise<void>;
    setDescription(desc: string): Promise<void>;
    setThumbnail(thumb: string): Promise<void>;
}
