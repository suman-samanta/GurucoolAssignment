const mongoose =require("mongoose");

const QuizSchema=new mongoose.Schema({
    question: String,
    options: [String],
    rightAnswer: Number,
    startDate: Date,
    endDate: Date,
    status: { type: String, default: 'inactive' }  
},{timestamps:true})

module.exports=mongoose.model("Quiz",QuizSchema);