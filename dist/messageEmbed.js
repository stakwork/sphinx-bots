"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageEmbed = /** @class */ (function () {
    function MessageEmbed() {
        this.author = '';
        this.title = '';
        this.color = '';
        this.description = '';
        this.thumbnail = '';
        this.html = '';
        this.fields = [];
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
    MessageEmbed.prototype.addField = function (f) {
        this.fields.push(f);
        return this.makeHTML();
    };
    MessageEmbed.prototype.addFields = function (fs) {
        this.fields = this.fields.concat(fs);
        return this.makeHTML();
    };
    MessageEmbed.prototype.makeHTML = function () {
        var h = '<div>';
        if (this.title) {
            h += "<div style=\"font-size:15px;margin:5px 0;\"><b>" + this.title + "</b></div>";
        }
        if (this.description) {
            h += "<div style=\"font-size:15px;margin:5px 0;\">" + this.description + "</div>";
        }
        if (this.fields && this.fields.length) {
            this.fields.forEach(function (f) {
                if (f.name && f.value) {
                    h += "<div style=\"margin:5px 0;\">";
                    h += "<div style=\"font-size:13px;opacity:0.7;\">" + f.name + "</div>";
                    h += "<div style=\"font-size:13px;\">" + f.value + "</div>";
                    h += "</div>";
                }
            });
        }
        h += '</div>';
        this.html = h;
        return this;
    };
    return MessageEmbed;
}());
exports.default = MessageEmbed;
