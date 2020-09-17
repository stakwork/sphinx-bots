"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dompurify = require("isomorphic-dompurify");
var sanitizer = dompurify.sanitize;
var MessageEmbed = /** @class */ (function () {
    function MessageEmbed() {
        this.author = '';
        this.title = '';
        this.color = '';
        this.description = '';
        this.thumbnail = '';
        this.html = '';
        this.fields = [];
        this.image = '';
    }
    MessageEmbed.prototype.setTitle = function (title) {
        this.title = title;
        return this.makeHTML();
    };
    MessageEmbed.prototype.setAuthor = function (author) {
        this.author = author;
        return this.makeHTML();
    };
    MessageEmbed.prototype.setColor = function (color) {
        this.color = color;
        return this.makeHTML();
    };
    MessageEmbed.prototype.setDescription = function (desc) {
        this.description = desc;
        return this.makeHTML();
    };
    MessageEmbed.prototype.setThumbnail = function (thumb) {
        this.thumbnail = thumb;
        return this.makeHTML();
    };
    MessageEmbed.prototype.setImage = function (image) {
        this.image = image;
        return this.makeHTML();
    };
    MessageEmbed.prototype.addField = function (f) {
        this.fields.push(f);
        return this.makeHTML();
    };
    MessageEmbed.prototype.addFields = function (fs) {
        this.fields = this.fields.concat(fs);
        return this.makeHTML();
    };
    MessageEmbed.prototype.makeHTML = function () {
        var h = '<div style="position:relative;max-width:280px;min-width:180px;">';
        if (this.title) {
            h += "<div style=\"font-size:15px;margin:5px 0;max-width:90%;\"><b>" + this.title + "</b></div>";
        }
        if (this.description) {
            h += "<div style=\"font-size:15px;margin:5px 0;max-width:90%;\">" + this.description + "</div>";
        }
        if (this.fields && this.fields.length) {
            this.fields.forEach(function (f) {
                if (f.name && f.value) {
                    var wrapStyle = "font-size:13px;margin:5px 0;" + (f.inline ? 'display:flex;flex-direction:row;align-items:center;' : '');
                    var valStyle = "" + (f.color && isColorString(f.color) ? 'color:' + f.color + ';' : '');
                    h += "<div style=\"" + wrapStyle + "\">";
                    h += "<div style=\"opacity:0.7;margin-right:8px;\">" + f.name + "</div>";
                    h += "<div style=\"" + valStyle + "\">" + f.value + "</div>";
                    h += "</div>";
                }
            });
        }
        if (this.thumbnail) {
            if (this.thumbnail.startsWith('<svg') && this.thumbnail.endsWith('</svg>')) {
                h += '<div style="position:absolute;top:0;right:0;">' + this.thumbnail + '</div>';
            }
            else {
                h += '<img style="position:absolute;top:0;right:0;height:16px;width:16px;" src="' + this.thumbnail + '" />';
            }
        }
        h += '</div>';
        this.html = sanitizer(h);
        return this;
    };
    return MessageEmbed;
}());
exports.default = MessageEmbed;
function isColorString(color) {
    return color ? true : false;
}
