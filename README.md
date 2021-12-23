![](https://github.com/stakwork/sphinx-docs/blob/master/bots/bots.png?raw=true)

The [Sphinx Javascript bot framework](https://github.com/stakwork/sphinx-bots) is inspired by Discord's bot creation library. So far we have only implemented simple Message creation, but there are exciting times ahead for bot developers on Sphinx!

### How it works

![](https://github.com/stakwork/sphinx-docs/blob/master/bots/bots_architecture.png?raw=true)

### MotherBot

Every sphinx-relay instance has a built-in bot called `MotherBot`. MotherBot is how you can search, install, and uninstall bots.

- `/bot search Bitcoin`
- `/bot install btc`
- `/bot uninstall btc`

### Creating a bot

Bots can be created on your sphinx-relay instance. By creating a bot, you are generating a bridge from the Lightning Network to the regular web (http). Bots are secured with a secret key that is generated when a bot is created. HTTPS should be used for all Bot endpoints.

**connect your bot**

```js
const client = new Sphinx.Client();
client.login(process.env.SPHINX_TOKEN);
```

**create a bot Message**

```js
const embed = new Sphinx.MessageEmbed()
  .setAuthor("TestBot")
  .setDescription("Welcome to TestBot!");
```

**respond to a "bot install" message**

```js
client.on(msg_types.INSTALL, async (message) => {
  const embed = new Sphinx.MessageEmbed()
    .setAuthor("TestBot")
    .setDescription("Welcome to TestBot!")
    .setThumbnail("<svg></svg>");
  message.channel.send({ embed });
});
```

**respond to a chat message**

```js
client.on(msg_types.MESSAGE, async (message) => {
  // do something here!
  const embed = new Sphinx.MessageEmbed()
    .setAuthor("TestBot")
    .setTitle("TestBot Message:")
    .addFields([
      { name: "Item #1:", value: "hello", inline: true },
      {
        name: "Item #2:",
        value: "hello again",
        inline: true,
        color: "#00FF00",
      },
    ])
    .setThumbnail("<svg></svg>");
  message.channel.send({ embed });
});
```

**respond to a chat message outside of the event emitter**

```ts
client.channels.cache.get(CHANNEL).send(<Sphinx.Msg>{
  content: `This is a message!`,
});
```

**boost a tribe member's message**

```ts
// you can get CHANNEL from a "message.channel.id"
client.channels.cache.get(CHANNEL).pay(<Sphinx.Msg>{
  amount: 1000,
  reply_id: "xxx", // optional uuid "message.reply_id"
  recipient_id: 1, // id of the tribe member "message.member.id"
});
```

# API

### Client

- ### `new Sphinx.Client()`
- ### `client.login(process.env.SPHINX_TOKEN)`

### Connecting

- ### `client.on(msg_types.INSTALL, callback)`
- ### `client.on(msg_types.MESSAGE, callback)`

### new Sphinx.MessageEmbed()

- ### `setTitle(title:string)`
- ### `setAuthor(author:string)`
- ### `setColor(color:string)`
- ### `setDescription(desc:string)`
- ### `setThumbnail(thumb:string)`
- ### `setImage(image:string)`
- ### `addField(f:Field)`
- ### `addFields(fs:Field[])`

```json
// "fields" are items in a list:
{
  "name": "string",
  "value": "string",
  "inline?": "boolean",
  "color?": "string"
}
```
