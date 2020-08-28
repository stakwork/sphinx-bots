
export interface Embed {
    author: string
    color: string
    description: string
    thumbnail: string
}

export default class MessageEmbed {

    embed: Embed = {
        author:'',
        color:'',
        description:'',
        thumbnail:'',
    }

    async setAuthor(author:string) {
        this.embed.author = author
    }

    async setColor(color:any) {
        this.embed.color = color
    }

    async setDescription(desc:string) {
        this.embed.description = desc
    }

    async setThumbnail(thumb:string) {
        this.embed.thumbnail = thumb
    }

}
