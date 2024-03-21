import express from "express";
import {createServer} from "http"
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 2300

const server = createServer(app);
const io = new Server(server)

io.on('connection', ()=>{
    console.log("a user connected")
})

app.use((req,res)=>{
    res.send('Welcome')
})

server.listen(PORT, ()=> {
    console.log('Server is listening on ' + PORT)
})