import * as dompurify from 'isomorphic-dompurify'
const sanitizer = dompurify.sanitize;

interface Field {
    name: string
    value: string
    inline?: boolean
    color?: string
}

export default class MessageEmbed {

    author: string = ''
    title: string = ''
    color: string = ''
    description: string = ''
    thumbnail: string = ''
    html: string = ''
    fields: Field[] = []
    image: string = ''

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

    setImage(image:string) {
        this.image = image
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
        let h:string = '<div style="position:relative;max-width:280px;min-width:180px;">'
        if(this.title) {
            h += `<div style="font-size:15px;margin:5px 0;max-width:90%;"><b>${this.title}</b></div>`
        }
        if(this.description) {
            h += `<div style="font-size:15px;margin:5px 0;max-width:90%;">${this.description}</div>`
        }
        if(this.fields && this.fields.length) {
            this.fields.forEach(f=>{
                if(f.name && f.value) {
                    const wrapStyle = `font-size:13px;margin:5px 0;${f.inline?'display:flex;flex-direction:row;align-items:center;':''}`
                    const valStyle = `${f.color && isColorString(f.color) ? 'color:'+f.color+';':''}`
                    h += `<div style="${wrapStyle}">`
                    h += `<div style="opacity:0.7;margin-right:8px;">${f.name}</div>`
                    h += `<div style="${valStyle}">${f.value}</div>`
                    h += `</div>`
                }
            })
        }
        if(this.thumbnail) {
            if(this.thumbnail.startsWith('<svg') && this.thumbnail.endsWith('</svg>')){
                h += '<div style="position:absolute;top:0;right:0;">'+this.thumbnail+'</div>'
            } else {
                h += '<img style="position:absolute;top:0;right:0;height:16px;width:16px;" src="'+this.thumbnail+'" />'
            }
        }
        h += '</div>'
        h += '<!-- sphinx:test -->'
        this.html = sanitizer(h)
        return this
    }

}

function isColorString(color:string):Boolean{
    return color?true:false
}