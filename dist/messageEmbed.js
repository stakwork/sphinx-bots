"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dompurify = require("isomorphic-dompurify");
var MessageEmbed = /** @class */ (function () {
    function MessageEmbed() {
        this.author = "";
        this.title = "";
        this.color = "";
        this.description = "";
        this.thumbnail = "";
        this.html = "";
        this.fields = [];
        this.image = "";
        this.only_owner = false;
        this.only_user = 0;
        this.only_pubkey = "";
        this.mode = "markdown";
    }
    MessageEmbed.prototype.setTitle = function (title) {
        this.title = title;
        return this.render();
    };
    MessageEmbed.prototype.setAuthor = function (author) {
        this.author = author;
        return this.render();
    };
    MessageEmbed.prototype.setColor = function (color) {
        this.color = color;
        return this.render();
    };
    MessageEmbed.prototype.setDescription = function (desc) {
        this.description = desc;
        return this.render();
    };
    MessageEmbed.prototype.setThumbnail = function (thumb) {
        this.thumbnail = thumb;
        return this.render();
    };
    MessageEmbed.prototype.setImage = function (image) {
        this.image = image;
        return this.render();
    };
    MessageEmbed.prototype.addField = function (f) {
        this.fields.push(f);
        return this.render();
    };
    MessageEmbed.prototype.addFields = function (fs) {
        this.fields = this.fields.concat(fs);
        return this.render();
    };
    MessageEmbed.prototype.setOnlyOwner = function (onlyOwner) {
        this.only_owner = onlyOwner;
        return this.render();
    };
    MessageEmbed.prototype.setOnlyUser = function (onlyUser) {
        this.only_user = onlyUser;
        return this.render();
    };
    MessageEmbed.prototype.setOnlyPubkey = function (onlyPubkey) {
        this.only_pubkey = onlyPubkey;
        return this.render();
    };
    MessageEmbed.prototype.render = function () {
        if (this.mode === "html") {
            return this.makeHTML();
        }
        else {
            return this.makeMarkdown();
        }
    };
    MessageEmbed.prototype.makeMarkdown = function () {
        var h = "";
        if (this.title) {
            h += "**" + this.title + "**\n";
        }
        if (this.description) {
            h += this.description + "\n";
        }
        if (this.fields && this.fields.length) {
            this.fields.forEach(function (f) {
                if (f.name && f.value) {
                    h += "- " + f.name + ": " + f.value + "\n";
                }
            });
        }
        if (this.image) {
            h += "![image](" + this.image + ")\n";
        }
        if (this.thumbnail) {
            h += "![thumbnail](" + this.thumbnail + ")\n";
        }
        this.html = h;
        return this;
    };
    MessageEmbed.prototype.makeHTML = function () {
        var h = '<div style="position:relative;max-width:fit-content;min-width:180px;">';
        if (this.title) {
            h += "<div style=\"font-size:15px;margin:5px 0;max-width:90%;\"><b>" + this.title + "</b></div>";
        }
        if (this.description) {
            h += "<div style=\"font-size:15px;margin:5px 0;max-width:90%;\">" + this.description + "</div>";
        }
        if (this.fields && this.fields.length) {
            this.fields.forEach(function (f) {
                if (f.name && f.value) {
                    var wrapStyle = "font-size:13px;margin:5px 0;" + (f.inline
                        ? "display:flex;flex-direction:row;align-items:center;"
                        : "");
                    var valStyle = "" + (f.color && isColorString(f.color) ? "color:" + f.color + ";" : "");
                    h += "<div style=\"" + wrapStyle + "\">";
                    h += "<div style=\"opacity:0.7;margin-right:8px;\">" + f.name + "</div>";
                    h += "<div style=\"" + valStyle + "\">" + f.value + "</div>";
                    h += "</div>";
                }
            });
        }
        if (this.thumbnail) {
            if (this.thumbnail.startsWith("<svg") &&
                this.thumbnail.endsWith("</svg>")) {
                h +=
                    '<div style="position:absolute;top:0;right:0;">' +
                        this.thumbnail +
                        "</div>";
            }
            else {
                h +=
                    '<img style="position:absolute;top:0;right:0;height:16px;width:16px;" src="' +
                        this.thumbnail +
                        '" />';
            }
        }
        if (this.image) {
            h += "<div style=\"display:flex;align-items:center;justify-content:center;width:100%;min-height:10rem;\"><img style=\"max-width:100%;object-fit:cover;\" src=\"" + this.image + "\"/></div>";
        }
        h += "</div>";
        // h += '<!-- sphinx:test -->'
        this.html = sanitize(h);
        return this;
    };
    return MessageEmbed;
}());
exports.default = MessageEmbed;
function sanitize(s) {
    var dirty = s
        .replace(/(<!--)/g, "<comment>")
        .replace(/(-->)/g, "</comment>");
    var config = { ADD_TAGS: ["comment"] };
    var clean = dompurify.sanitize(dirty, config);
    return clean.replace(/(<comment>)/g, "<!--").replace(/(<\/comment>)/g, "-->");
}
function isColorString(color) {
    return color ? true : false;
}
