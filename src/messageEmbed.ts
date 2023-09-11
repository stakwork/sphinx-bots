import * as dompurify from "isomorphic-dompurify";

interface Field {
  name: string;
  value: string;
  inline?: boolean;
  color?: string;
}

export default class MessageEmbed {
  author: string = "";
  title: string = "";
  color: string = "";
  description: string = "";
  thumbnail: string = "";
  html: string = "";
  fields: Field[] = [];
  image: string = "";
  only_owner: boolean = false;
  only_user: number = 0;
  only_pubkey: string = "";

  setTitle(title: string) {
    this.title = title;
    return this.makeHTML();
  }

  setAuthor(author: string) {
    this.author = author;
    return this.makeHTML();
  }

  setColor(color: any) {
    this.color = color;
    return this.makeHTML();
  }

  setDescription(desc: string) {
    this.description = desc;
    return this.makeHTML();
  }

  setThumbnail(thumb: string) {
    this.thumbnail = thumb;
    return this.makeHTML();
  }

  setImage(image: string) {
    this.image = image;
    return this.makeHTML();
  }

  addField(f: Field) {
    this.fields.push(f);
    return this.makeHTML();
  }

  addFields(fs: Field[]) {
    this.fields = this.fields.concat(fs);
    return this.makeHTML();
  }

  setOnlyOwner(onlyOwner: boolean) {
    this.only_owner = onlyOwner;
    return this.makeHTML();
  }

  setOnlyUser(onlyUser: number) {
    this.only_user = onlyUser;
    return this.makeHTML();
  }

  setOnlyPubkey(onlyPubkey: string) {
    this.only_pubkey = onlyPubkey;
    return this.makeHTML();
  }

  makeHTML() {
    let h: string =
      '<div style="position:relative;max-width:fit-content;min-width:180px;">';
    if (this.title) {
      h += `<div style="font-size:15px;margin:5px 0;max-width:90%;"><b>${this.title}</b></div>`;
    }
    if (this.description) {
      h += `<div style="font-size:15px;margin:5px 0;max-width:90%;">${this.description}</div>`;
    }
    if (this.fields && this.fields.length) {
      this.fields.forEach((f) => {
        if (f.name && f.value) {
          const wrapStyle = `font-size:13px;margin:5px 0;${
            f.inline
              ? "display:flex;flex-direction:row;align-items:center;"
              : ""
          }`;
          const valStyle = `${
            f.color && isColorString(f.color) ? "color:" + f.color + ";" : ""
          }`;
          h += `<div style="${wrapStyle}">`;
          h += `<div style="opacity:0.7;margin-right:8px;">${f.name}</div>`;
          h += `<div style="${valStyle}">${f.value}</div>`;
          h += `</div>`;
        }
      });
    }
    if (this.thumbnail) {
      if (
        this.thumbnail.startsWith("<svg") &&
        this.thumbnail.endsWith("</svg>")
      ) {
        h +=
          '<div style="position:absolute;top:0;right:0;">' +
          this.thumbnail +
          "</div>";
      } else {
        h +=
          '<img style="position:absolute;top:0;right:0;height:16px;width:16px;" src="' +
          this.thumbnail +
          '" />';
      }
    }
    if (this.image) {
      h += `<div style="display:flex;align-items:center;justify-content:center;width:100%;min-height:10rem;"><img style="max-width:100%;object-fit:cover;" src="${this.image}"/></div>`;
    }
    h += "</div>";
    // h += '<!-- sphinx:test -->'
    this.html = sanitize(h);
    return this;
  }
}

function sanitize(s: string) {
  const dirty = s
    .replace(/(<!--)/g, "<comment>")
    .replace(/(-->)/g, "</comment>");
  var config = { ADD_TAGS: ["comment"] };
  var clean = dompurify.sanitize(dirty, config);
  return clean.replace(/(<comment>)/g, "<!--").replace(/(<\/comment>)/g, "-->");
}

function isColorString(color: string): Boolean {
  return color ? true : false;
}
