const mongoose =require("mongoose");

const QuizSchema=new mongoose.Schema({
    question: String,
    options: [String],
    rightAnswer: Number,
    startDate: Date,
    endDate: Date  
},{timestamps:true})

module.exports=mongoose.model("Quiz",QuizSchema);