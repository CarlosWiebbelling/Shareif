const home = (req, res) => res.send('Clicou na home')

const getMessages = (req, res) => res.send(`Quer as mensagens do chat ${ req.body.chat }`)

const sendMessage = (req, res) => req.send(`Quer enviar a mensagem ${ req.body.message } para o chat ${ req.body.chat }`)

module.exports = { home, getMessages, home3 }