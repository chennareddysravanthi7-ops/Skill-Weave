import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Target, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import { getStudentProfile } from '../utils/localStorage';

const MLResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const quizResult = location.state?.quizResult;
  
  useEffect(() => {
    if (!quizResult) {
      navigate('/quiz');
      return;
    }
    
    const studentProfile = getStudentProfile();
    setProfile(studentProfile);
  }, [quizResult, navigate]);
  
  if (!quizResult || !profile) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  const getLevelColor = (level) => {
    switch(level) {
      case 'Easy':
        return { bg: 'from-green-500 to-emerald-500', text: 'text-green-700', badge: 'bg-green-100' };
      case 'Medium':
        return { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-700', badge: 'bg-yellow-100' };
      case 'Hard':
        return { bg: 'from-purple-500 to-pink-500', text: 'text-purple-700', badge: 'bg-purple-100' };
      default:
        return { bg: 'from-indigo-500 to-teal-500', text: 'text-indigo-700', badge: 'bg-indigo-100' };
    }
  };
  
  const levelColors = getLevelColor(profile?.level);
  
  const getRecommendations = () => {
    if (quizResult.score < 40) {
      return [
        'Start with foundational concepts in your weak topics',
        'Watch Easy-level video tutorials for better understanding',
        'Practice basic quizzes to build confidence',
        'Focus on one topic at a time',
      ];
    } else if (quizResult.score <= 70) {
      return [
        'Review Medium-level content to strengthen your understanding',
        'Practice more quizzes on your weak topics',
        'Try to identify patterns in mistakes',
        'Balance between learning new concepts and revision',
      ];
    } else {
      return [
        'Challenge yourself with Hard-level content',
        'Explore advanced concepts and applications',
        'Help others to reinforce your knowledge',
        'Focus on time management and accuracy',
      ];
    }
  };
  
  const recommendations = getRecommendations();
  
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 mb-6 shadow-lg">
            <Trophy size={48} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Quiz Complete! 🎉
          </h1>
          <p className="text-lg text-slate-600">
            Here's your performance analysis
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 text-center" data-testid="score-card">
            <Target size={32} className="mx-auto mb-3 text-teal-600" />
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Your Score</p>
            <p className="text-4xl font-bold text-slate-900">{quizResult.score}%</p>
            <p className="text-sm text-slate-500 mt-2">
              {quizResult.correctAnswers} of {quizResult.totalQuestions} correct
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 text-center" data-testid="level-card">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${levelColors.bg} mb-3`}>
              <TrendingUp size={24} className="text-white" />
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Classified Level</p>
            <p className={`text-3xl font-bold ${levelColors.text}`}>{profile.level}</p>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 text-center" data-testid="confidence-card">
            <BookOpen size={32} className="mx-auto mb-3 text-indigo-600" />
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Confidence</p>
            <p className="text-4xl font-bold text-slate-900">{profile.confidence}%</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center space-x-2">
            <Target size={24} className="text-indigo-600" />
            <span>Your Personalized Learning Path</span>
          </h2>
          
          <div className={`inline-flex items-center space-x-2 ${levelColors.badge} ${levelColors.text} px-4 py-2 rounded-full text-sm font-medium mb-6`}>
            <span>Recommended Level: {profile.level}</span>
          </div>
          
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3" data-testid={`recommendation-${index}`}>
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-slate-700 leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/learning')}
            data-testid="explore-content-btn"
            className="rounded-xl px-6 py-4 font-semibold bg-indigo-700 text-white hover:bg-indigo-800 transition-all shadow-lg flex items-center justify-center space-x-2"
          >
            <BookOpen size={20} />
            <span>Explore Learning Content</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            data-testid="view-dashboard-btn"
            className="rounded-xl px-6 py-4 font-semibold border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center space-x-2"
          >
            <ArrowRight size={20} />
            <span>View Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MLResultPage;
