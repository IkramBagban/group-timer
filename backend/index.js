import express from "express";
import {createServer} from "http"
import { Server } from "socket.io";
import cors from 'cors'
const app = express();
const PORT = process.env.PORT || 2300

const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin : '*'
    }
})

app.use(cors())

io.on('connection', (socket)=>{
    console.log("a user connected " + socket.id)

    socket.emit("hello", "world");
    
    })

app.use((req,res)=>{
    res.send('Welcome')
})

server.listen(PORT, ()=> {
    console.log('Server is listening on ' + PORT)
})