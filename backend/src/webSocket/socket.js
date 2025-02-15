
let io
const startWebSockets = (server)=>{
    io = server;
    io.on("connection",(socket)=>{
        console.log("user use connected",socket.id);
        socket.on("dissconnect",()=>{
            console.log("disconnected user",socket.id)
        })
    })
}

 export {startWebSockets,io};