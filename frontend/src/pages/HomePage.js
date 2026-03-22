import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { getStudentProfile, initializeStudent } from '../utils/localStorage';

const HomePage = () => {
  const navigate = useNavigate();
  const [hasProfile, setHasProfile] = useState(false);
  
  useEffect(() => {
    const profile = getStudentProfile();
    setHasProfile(!!profile);
  }, []);
  
  const handleStart = () => {
    if (!hasProfile) {
      initializeStudent('Student');
    }
    navigate('/quiz');
  };
  
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Adaptive Learning',
      description: 'Our intelligent system analyzes your performance and adapts content to your learning level in real-time.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Target,
      title: 'Personalized Learning Path',
      description: 'Get customized recommendations based on your strengths and areas that need improvement.',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Track Your Progress',
      description: 'Visualize your learning journey with detailed analytics and performance insights.',
      color: 'from-orange-500 to-pink-500',
    },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-20">
          <div className="md:col-span-7 space-y-8">
            <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles size={16} />

            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Decode Concepts{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500">
                 Dominate Exams
              </span>
            </h1>
            
            <p className="text-lg leading-relaxed text-slate-600 max-w-xl">
               Our intelligent platform analyzes your quiz performance, detects weak concepts, and automatically generates a personalized learning path with videos, quizzes, and activities designed to help you master every topic.
            </p>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleStart}
                data-testid="start-learning-btn"
                className="group rounded-full px-8 py-4 font-semibold bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-800 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
              >
                <span>{hasProfile ? 'Continue Learning' : 'Start Learning Now'}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              {hasProfile && (
                <button
                  onClick={() => navigate('/dashboard')}
                  data-testid="view-dashboard-btn"
                  className="rounded-lg px-6 py-4 font-medium border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  View Dashboard
                </button>
              )}
            </div>
          </div>
          
          <div className="md:col-span-5 ml-[-20px] mt-[40px]">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-teal-400/20 rounded-3xl blur-3xl"></div>
              <img
                src="/images/1st.jpg"
                alt="Student learning"
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-slate-900">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  data-testid={`feature-card-${index}`}
                  className="p-8 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl transition-all duration-500 group"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4 text-slate-900">{feature.title}</h3>
                  <p className="text-base leading-relaxed text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-teal-500 rounded-3xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students who are already learning smarter with our AI-powered platform.
          </p>
          <button
            onClick={handleStart}
            data-testid="cta-start-btn"
            className="rounded-full px-8 py-4 font-semibold bg-white text-indigo-700 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Get Started Free
          </button>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/student-login')}
              className="rounded-full px-6 py-3 font-medium bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all"
            >
              Student Login
            </button>
            <button
              onClick={() => navigate('/admin-login')}
              className="rounded-full px-6 py-3 font-medium bg-teal-500 text-white hover:bg-teal-600 hover:scale-105 active:scale-95 transition-all"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
