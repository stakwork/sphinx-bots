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
    only_owner: boolean;
    only_user: number;
    only_pubkey: string;
    setTitle(title: string): this;
    setAuthor(author: string): this;
    setColor(color: any): this;
    setDescription(desc: string): this;
    setThumbnail(thumb: string): this;
    setImage(image: string): this;
    addField(f: Field): this;
    addFields(fs: Field[]): this;
    setOnlyOwner(onlyOwner: boolean): this;
    setOnlyUser(onlyUser: number): this;
    setOnlyPubkey(onlyPubkey: string): this;
    makeHTML(): this;
}
export {};
