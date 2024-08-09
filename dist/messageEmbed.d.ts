interface Field {
    name: string;
    value: string;
    inline?: boolean;
    color?: string;
}
declare type RenderMode = "html" | "markdown" | "plaintext";
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
    mode: RenderMode;
    setTitle(title: string): void | this;
    setAuthor(author: string): void | this;
    setColor(color: any): void | this;
    setDescription(desc: string): void | this;
    setThumbnail(thumb: string): void | this;
    setImage(image: string): void | this;
    addField(f: Field): void | this;
    addFields(fs: Field[]): void | this;
    setOnlyOwner(onlyOwner: boolean): void | this;
    setOnlyUser(onlyUser: number): void | this;
    setOnlyPubkey(onlyPubkey: string): void | this;
    render(): void | this;
    makeMarkdown(): void;
    makeHTML(): this;
}
export {};
