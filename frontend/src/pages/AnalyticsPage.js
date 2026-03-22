import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Target, Award, BookOpen } from 'lucide-react';
import { getQuizHistory, getProgress, getWeakTopics, getStudentProfile } from '../utils/localStorage';
import { topics } from '../data/topics';

const AnalyticsPage = () => {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState(null);
  const [weakTopics, setWeakTopics] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [topicPerformance, setTopicPerformance] = useState([]);
  const [difficultyData, setDifficultyData] = useState([]);
  
  useEffect(() => {
    const studentProfile = getStudentProfile();
    const quizHistory = getQuizHistory();
    const studentProgress = getProgress();
    const weakTopicsList = getWeakTopics();
    
    setProfile(studentProfile);
    setHistory(quizHistory);
    setProgress(studentProgress);
    setWeakTopics(weakTopicsList);
    
    const scores = quizHistory.map((quiz, index) => ({
      name: `Q${index + 1}`,
      score: quiz.score,
      date: new Date(quiz.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
    setScoreData(scores);
    
    const topicStats = {};
    topics.forEach(topic => {
      topicStats[topic.name] = { total: 0, errors: 0 };
    });
    
    quizHistory.forEach(quiz => {
      if (quiz.incorrectTopics) {
        quiz.incorrectTopics.forEach(topicId => {
          const topic = topics.find(t => t.id === topicId);
          if (topic) {
            topicStats[topic.name].errors += 1;
          }
        });
      }
    });
    
    const topicPerf = Object.keys(topicStats).map(topicName => {
      const totalQuizzes = quizHistory.length || 1;
      const errorRate = topicStats[topicName].errors;
      const mastery = Math.max(0, 100 - (errorRate / totalQuizzes) * 20);
      
      return {
        topic: topicName,
        mastery: Math.round(mastery),
      };
    });
    setTopicPerformance(topicPerf);
    
    const difficultyStats = { Easy: 0, Medium: 0, Hard: 0 };
    quizHistory.forEach(quiz => {
      if (quiz.difficulty && difficultyStats.hasOwnProperty(quiz.difficulty)) {
        difficultyStats[quiz.difficulty] += quiz.score;
      }
    });
    
    const diffData = Object.keys(difficultyStats).map(level => ({
      level,
      avgScore: quizHistory.filter(q => q.difficulty === level).length > 0
        ? Math.round(difficultyStats[level] / quizHistory.filter(q => q.difficulty === level).length)
        : 0,
    }));
    setDifficultyData(diffData);
    
  }, []);
  
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BookOpen size={64} className="mx-auto mb-4 text-slate-300" />
          <p className="text-lg text-slate-500">No analytics data yet</p>
          <p className="text-sm text-slate-400 mt-2">Start taking quizzes to see your progress</p>
        </div>
      </div>
    );
  }
  
  const stats = [
    {
      icon: Award,
      label: 'Total Quizzes',
      value: progress?.totalQuizzes || 0,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: TrendingUp,
      label: 'Average Score',
      value: `${progress?.averageScore || 0}%`,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      icon: Target,
      label: 'Current Level',
      value: profile.level || 'Not Set',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Performance Analytics
          </h1>
          <p className="text-base leading-relaxed text-slate-600">
            Detailed insights into your learning progress
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                data-testid={`analytics-stat-${index}`}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-6"
              >
                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center mb-4`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Quiz Scores Over Time</h2>
            
            {scoreData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#4338ca" strokeWidth={2} name="Score (%)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-slate-400">
                <p>No quiz data available</p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Performance by Difficulty</h2>
            
            {difficultyData.some(d => d.avgScore > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={difficultyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="level" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="avgScore" fill="#0d9488" name="Average Score (%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-slate-400">
                <p>No difficulty data available</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Topic Mastery</h2>
            
            {topicPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={topicPerformance}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="topic" style={{ fontSize: '11px' }} />
                  <PolarRadiusAxis domain={[0, 100]} style={{ fontSize: '10px' }} />
                  <Radar name="Mastery (%)" dataKey="mastery" stroke="#4338ca" fill="#4338ca" fillOpacity={0.5} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-400 flex items-center justify-center text-slate-400">
                <p>No topic data available</p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Areas for Improvement</h2>
            
            {weakTopics.length > 0 ? (
              <div className="space-y-4">
                {weakTopics.map((topic, index) => {
                  const errorPercentage = Math.min((topic.errorCount / (history.length || 1)) * 100, 100);
                  
                  return (
                    <div key={index} data-testid={`weak-topic-analytics-${index}`} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900">{topic.topicName}</span>
                        <span className="text-sm text-slate-500">{topic.errorCount} errors</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                          style={{ width: `${errorPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-400">
                <div className="text-center">
                  <Target size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Great job! No weak topics identified</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
