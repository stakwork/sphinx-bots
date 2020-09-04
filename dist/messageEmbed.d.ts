interface Field {
    name: string;
    value: string;
}
export default class MessageEmbed {
    author: string;
    title: string;
    color: string;
    description: string;
    thumbnail: string;
    html: string;
    fields: Field[];
    setTitle(title: string): this;
    setAuthor(author: string): this;
    setColor(color: any): this;
    setDescription(desc: string): this;
    setThumbnail(thumb: string): this;
    addField(f: Field): this;
    addFields(fs: Field[]): this;
    makeHTML(): this;
}
export {};
