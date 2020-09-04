
interface Field {
    name: string
    value: string
}

export default class MessageEmbed {

    author: string = ''
    title: string = ''
    color: string = ''
    description: string = ''
    thumbnail: string = ''
    html: string = ''
    fields: Field[] = []

    setTitle(title:string) {
        this.title = title
        return this.makeHTML()
    }

    setAuthor(author:string) {
        this.author = author
        return this.makeHTML()
    }

    setColor(color:any) {
        this.color = color
        return this.makeHTML()
    }

    setDescription(desc:string) {
        this.description = desc
        return this.makeHTML()
    }

    setThumbnail(thumb:string) {
        this.thumbnail = thumb
        return this.makeHTML()
    }

    addField(f:Field) {
        this.fields.push(f)
        return this.makeHTML()
    }

    addFields(fs:Field[]) {
        this.fields = this.fields.concat(fs)
        return this.makeHTML()
    }

    makeHTML(){
        let h:string = '<div>'
        if(this.title) {
            h += `<div style="font-size:14px;margin:5px 0;"><b>${this.title}</b></div>`
        }
        if(this.description) {
            h += `<div style="font-size:14px;margin:5px 0;">${this.description}</div>`
        }
        if(this.fields && this.fields.length) {
            this.fields.forEach(f=>{
                if(f.name && f.value) {
                    h += `<div style="margin:5px 0;">`
                    h += `<div style="font-size:12px;opacity:0.7;">${f.name}</div>`
                    h += `<div style="font-size:12px;">${f.value}</div>`
                    h += `</div>`
                }
            })
           
        }
        h += '</div>'
        this.html = h
        return this
    }

}
