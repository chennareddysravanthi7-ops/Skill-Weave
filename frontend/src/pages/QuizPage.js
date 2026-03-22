import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { getInitialAssessment, getAdaptiveQuizzes } from '../data/quizzes';
import { getStudentProfile, addQuizResult, updateStudentProfile, classifyStudentLevel } from '../utils/localStorage';
import { Progress } from '../components/ui/progress';

const QuizPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    const studentProfile = getStudentProfile();
    setProfile(studentProfile);
    
    if (!studentProfile || !studentProfile.level) {
      setCurrentQuiz(getInitialAssessment());
    } else {
      const adaptiveQuizzes = getAdaptiveQuizzes(studentProfile.level);
      if (adaptiveQuizzes.length > 0) {
        const randomQuiz = adaptiveQuizzes[Math.floor(Math.random() * adaptiveQuizzes.length)];
        setCurrentQuiz(randomQuiz);
      } else {
        setCurrentQuiz(getInitialAssessment());
      }
    }
  }, []);
  
  if (!currentQuiz) {
    return <div className="flex items-center justify-center min-h-screen">Loading quiz...</div>;
  }
  
  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / currentQuiz.questions.length) * 100;
  
  const handleAnswerSelect = (answerIndex) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };
  
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newAnswers = [...answers, { 
      questionId: currentQuestion.id, 
      selected: selectedAnswer, 
      correct: isCorrect,
      topicId: currentQuestion.topicId 
    }];
    setAnswers(newAnswers);
    setShowFeedback(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      completeQuiz();
    }
  };
  
  const completeQuiz = () => {
    const finalScore = Math.round((score / currentQuiz.questions.length) * 100);
    const incorrectTopics = answers.filter(a => !a.correct).map(a => a.topicId);
    
    const quizResult = {
      quizId: currentQuiz.id,
      quizTitle: currentQuiz.title,
      score: finalScore,
      difficulty: currentQuiz.difficulty,
      totalQuestions: currentQuiz.questions.length,
      correctAnswers: score,
      incorrectTopics: [...new Set(incorrectTopics)],
    };
    
    addQuizResult(quizResult);
    
    if (!profile || !profile.level || currentQuiz.type === 'mixed') {
      const level = classifyStudentLevel(finalScore);
      updateStudentProfile({ level });
    }
    
    setQuizComplete(true);
    navigate('/result', { state: { quizResult } });
  };
  
  const isCorrectAnswer = (index) => {
    return showFeedback && index === currentQuestion.correctAnswer;
  };
  
  const isWrongAnswer = (index) => {
    return showFeedback && index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer;
  };
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-slate-600">{currentQuiz.title}</h2>
            <span className="text-sm text-slate-500">
              Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" data-testid="quiz-progress" />
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 md:p-12" data-testid="question-card">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-4">
              {currentQuestion.difficulty}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              {currentQuestion.question}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = isCorrectAnswer(index);
              const isWrong = isWrongAnswer(index);
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  data-testid={`option-${index}`}
                  className={`
                    relative p-6 rounded-xl border-2 text-left font-medium transition-all
                    ${isCorrect 
                      ? 'border-teal-500 bg-teal-50 text-teal-900' 
                      : isWrong 
                      ? 'border-red-500 bg-red-50 text-red-900'
                      : isSelected
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50'
                    }
                    ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isCorrect && <CheckCircle2 size={24} className="text-teal-600" />}
                    {isWrong && <XCircle size={24} className="text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="flex justify-end">
            {!showFeedback ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                data-testid="submit-answer-btn"
                className="rounded-full px-8 py-3 font-semibold bg-indigo-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-indigo-800 hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                data-testid="next-question-btn"
                className="rounded-full px-8 py-3 font-semibold bg-indigo-700 text-white hover:bg-indigo-800 hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
