const Quiz=require("../models/Quiz")


exports.createNewQuiz=async (req, res) => {

  const response=req.header('Authorization');
  if(response===undefined){
      return res.status(401).json({error:"Please add the token in authorisation"})
  }
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
  res.status(200).json(quiz);
  }catch(err){
    res.status(500).json(err);
  }
};

exports.getActiveQuizes= async (req, res) => {

  const response=req.header('Authorization');
  if(response===undefined){
      return res.status(401).json({error:"Please add the token in authorisation"})
  }
    try{
        const quiz = await Quiz.find({status:'active'});
        res.status(200).json(quiz);
    }catch(err){
        res.status(500).json(err);
    }  
  }

exports.getResultOfAQuiz=async (req, res) => {
  const response=req.header('Authorization');
  if(response===undefined){
      return res.status(401).json({error:"Please add the token in authorisation"})
  }
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
  const response=req.header('Authorization');
  if(response===undefined){
      return res.status(401).json({error:"Please add the token in authorisation"})
  }
    try{   
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    }catch(err){
        res.status(500).json(err);
    }
  }