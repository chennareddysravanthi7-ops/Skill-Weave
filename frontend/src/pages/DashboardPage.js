import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Flame, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { getStudentProfile, getQuizHistory, getProgress, getWeakTopics, calculateConfidence, initializeStudent } from '../utils/localStorage';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [weakTopics, setWeakTopics] = useState([]);
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    let studentProfile = getStudentProfile();
    if (!studentProfile) {
      studentProfile = initializeStudent('Student');
    }
    
    const history = getQuizHistory();
    const confidence = calculateConfidence(history);
    
    studentProfile.confidence = confidence;
    setProfile(studentProfile);
    setProgress(getProgress());
    setWeakTopics(getWeakTopics());
    
    const chartDataPoints = history.slice(-10).map((quiz, index) => ({
      name: `Quiz ${index + 1}`,
      score: quiz.score,
    }));
    setChartData(chartDataPoints);
  }, []);
  
  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  const stats = [
    {
      icon: Trophy,
      label: 'Current Level',
      value: profile.level || 'Not Set',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
    },
    {
      icon: Target,
      label: 'Confidence Score',
      value: `${profile.confidence}%`,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
    },
    {
      icon: Flame,
      label: 'Learning Streak',
      value: `${progress?.streak || 0} days`,
      color: 'from-orange-500 to-pink-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ];
  
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Welcome back, {profile.name}! 👋
          </h1>
          <p className="text-base leading-relaxed text-slate-600">
            Here's your learning progress overview
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                data-testid={`stat-card-${index}`}
                className="flex flex-col justify-between p-6 bg-white rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon size={24} className={stat.textColor} />
                  </div>
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${stat.color} opacity-10 absolute -top-8 -right-8`}></div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          <div className="md:col-span-8 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Progress Overview</h2>
                <p className="text-sm text-slate-500 mt-1">Your quiz performance over time</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <TrendingUp size={16} className="text-teal-500" />
                <span>Average: {progress?.averageScore || 0}%</span>
              </div>
            </div>
            
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4338ca" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4338ca" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Area type="monotone" dataKey="score" stroke="#4338ca" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No quiz data yet. Start your first quiz!</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="md:col-span-4 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Weak Topics</h2>
            
            {weakTopics.length > 0 ? (
              <div className="space-y-4">
                {weakTopics.map((topic, index) => (
                  <div
                    key={index}
                    data-testid={`weak-topic-${index}`}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{topic.topicName}</p>
                      <p className="text-sm text-slate-500">{topic.errorCount} mistakes</p>
                    </div>
                    <button
                      onClick={() => navigate('/learning')}
                      data-testid={`practice-btn-${index}`}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                    >
                      Practice
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Target size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm">No weak topics identified yet</p>
                <p className="text-xs mt-2">Take quizzes to see your progress</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-teal-500 rounded-2xl p-8 text-white flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready for your next challenge?</h3>
            <p className="opacity-90">Continue your learning journey with adaptive quizzes</p>
          </div>
          <button
            onClick={() => navigate('/quiz')}
            data-testid="take-quiz-btn"
            className="rounded-full px-6 py-3 font-semibold bg-white text-indigo-700 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center space-x-2"
          >
            <span>Take Quiz</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
