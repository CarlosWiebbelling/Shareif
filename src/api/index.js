const express = require("express");
const chat = require('../api/controlers/chat')

const app = express();
const port = 3001;

app.get("/", (req, res) => chat.home(req, res))

// receives the public key for the specifed chat in the request header and return the chat messages
app.get("/chat/:id", (req, res) => chat.getMessages(req, res))

// receives the users' public and the chats' private key of the chat, and the public key of the in header and the message in body
app.post("/chat/:id", (req, res) => chat.sendMessage(req, res))

app.listen(port, (req, res) => console.log(`Running on port: ${port}`));
