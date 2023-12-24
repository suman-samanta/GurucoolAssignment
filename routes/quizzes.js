const express=require("express");
const router=express.Router();
const quizController=require("../controller/quizcontroller");

// POST endpoint to create a quiz
router.post('/quizzes',quizController.createNewQuiz);

// GET endpoint to retrieve the active quiz
router.get('/quizzes/active',quizController.getActiveQuizes);

// GET endpoint to retrieve the result of a quiz
router.get('/quizzes/:id/result',quizController.getResultOfAQuiz);

// GET endpoint to retrieve all quizzes
router.get('/quizzes/all',quizController.getAllQuizes);

module.exports=router;