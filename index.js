const express=require("express");
const http=require("http");
const config=require('./config/default');
const port=config.port;
const app=express();
const dotenv= require("dotenv");
const mongoose=require("mongoose");
const bodyParser = require('body-parser');
const quizRoute=require("./routes/quizzes");

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
dotenv.config();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(allowCrossDomain);
mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
.then(()=>console.log("connection successful...Mongodb Database connected successfully"))
.catch((err)=>console.log(err));
app.use(quizRoute);

try{
    const server=http.createServer(app);
    server.listen(port,()=>{
        console.log("server is running on port : "+port);
    });
}catch(err){
    console.log(err);
}