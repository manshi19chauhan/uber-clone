const http = require('http');
const app = require('./app.js');


const port = process.env.PORT || 3000;
// console.log("creating server");
const server = http.createServer(app);
// console.log("created server");
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
// console.log("server listened");