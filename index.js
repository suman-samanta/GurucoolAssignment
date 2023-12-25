const express=require("express");
const http=require("http");
const config=require('./config/default');
const port=config.port;
const app=express();
const dotenv= require("dotenv");
const mongoose=require("mongoose");
const bodyParser = require('body-parser');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');


const quizRoute=require("./routes/quizzes");
const userRoute=require("./routes/auth");
const Quiz=require("./models/Quiz");

// CrossDomain MiddleWare
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


// Mongoose Middleware for ODM
mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
.then(()=>console.log("connection successful...Mongodb Database connected successfully"))
.catch((err)=>console.log(err));

app.use(userRoute);

// JWT-based authentication middleware
app.use((req, res, next) => {
    // Get the token from the request header
    const response=req.header('Authorization');
    if(response===undefined){
        return res.status(401).json({error:"Please add the token in authorisation"})
    }
    const token = req.header('Authorization').replace('Bearer ', '');

    
    // Verify the token
    jwt.verify(token,process.env.JWT_SECRET, (err, payload) => {
      if (err) return res.status(401).send({ error: 'Unauthorized' });
      req.user = payload;
      next();
    });
  });

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });


app.use(limiter);
app.use(quizRoute);


cron.schedule(' */5 * * * *', async() => {
    const now = new Date();
    const quizzes=await Quiz.find();
    try{
        quizzes.forEach(quiz => {
            if (now >= quiz.startDate && now <= quiz.endDate) {
              quiz.status = 'active';
         
            } else if (now > quiz.endDate) {
              quiz.status = 'finished';
            }
           
            quiz.save();
          });
          
    }catch(err){
        console.log(err);
    }

  });

try{
    const server=http.createServer(app);
    server.listen(port,()=>{
        console.log("server is running on port : "+port);
    });
}catch(err){
    console.log(err);
}