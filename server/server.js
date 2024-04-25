const mongoose = require('mongoose')
const Document = require('./Document')

mongoose.connect("mongodb+srv://kunwar:123@cluster0.592qg87.mongodb.net/")

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

io.on("connection", socket => {
    socket.on('get-document', async documentId => {
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)
        socket.emit('load-document', document.data)

        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit('recieve-changes', delta)
        })
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, {data})
        })
    })
})

const defaultValue = ""

async function findOrCreateDocument(id){
    if(id == null) return;

    const document = await Document.findById(id);
    if(document) return document
    return await Document.create({_id: id, data: defaultValue})
}

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
