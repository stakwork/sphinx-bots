interface Field {
    name: string;
    value: string;
    inline?: boolean;
    color?: string;
}
export default class MessageEmbed {
    author: string;
    title: string;
    color: string;
    description: string;
    thumbnail: string;
    html: string;
    fields: Field[];
    image: string;
    setTitle(title: string): this;
    setAuthor(author: string): this;
    setColor(color: any): this;
    setDescription(desc: string): this;
    setThumbnail(thumb: string): this;
    setImage(image: string): this;
    addField(f: Field): this;
    addFields(fs: Field[]): this;
    makeHTML(): this;
}
export {};
