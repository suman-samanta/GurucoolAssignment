const Quiz=require("../models/Quiz")

exports.createNewQuiz=async (req, res) => {
    const {question,options,rightAnswer,startDate,endDate}=req.body;
    const newStartDate=new Date(startDate);
    const newEndDate=new Date(endDate);
  try{
    const quiz = new Quiz({
        question:question,
        options:options,
        rightAnswer,
        startDate:newStartDate,
        endDate:newEndDate
    });
  await quiz.save();
  res.send(quiz);
  }catch(err){
    res.status(500).json(err);
  }
};

exports.getActiveQuizes= async (req, res) => {
    try{
        const now = new Date();
        const quiz = await Quiz.find({ startDate: { $lte: now }, endDate: { $gte: now } });
        res.status(200).json(quiz);
    }catch(err){
        res.status(500).json(err);
    }  
  }

exports.getResultOfAQuiz=async (req, res) => {
    try{
        const quiz = await Quiz.findById(req.params.id);
        if (new Date() - quiz.endDate >= 5 * 60 * 1000) { // 5 minutes after the quiz's end time
        res.status(200).json({ rightAnswer: quiz.rightAnswer });
        } else {
        res.status(400).json('Quiz result is not available yet.');
        }
    }catch(err){
        res.status(500).json(err);
    }   
  }

exports.getAllQuizes=async (req, res) => {
    try{   
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    }catch(err){
        res.status(500).json(err);
    }
  }