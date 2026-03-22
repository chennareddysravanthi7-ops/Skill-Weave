import React, { useState, useEffect } from 'react';
import { Play, BookOpen, FileQuestion } from 'lucide-react';
import { getStudentProfile, initializeStudent } from '../utils/localStorage';
import { learningContent, getContentByDifficulty } from '../data/learningContent';
import { topics } from '../data/topics';

const LearningContentPage = () => {
  const [profile, setProfile] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [filteredContent, setFilteredContent] = useState(learningContent);
  
  useEffect(() => {
    let studentProfile = getStudentProfile();
    if (!studentProfile) {
      studentProfile = initializeStudent('Student');
    }
    setProfile(studentProfile);
    
    if (studentProfile.level) {
      setSelectedDifficulty(studentProfile.level);
    }
  }, []);
  
  useEffect(() => {
    let filtered = learningContent;
    
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(content => content.difficulty === selectedDifficulty);
    }
    
    if (selectedSubject !== 'All') {
      const subjectTopics = topics.filter(t => t.subject === selectedSubject).map(t => t.id);
      filtered = filtered.filter(content => subjectTopics.includes(content.topicId));
    }
    
    setFilteredContent(filtered);
  }, [selectedDifficulty, selectedSubject]);
  
  const difficultyLevels = ['All', 'Easy', 'Medium', 'Hard'];
  const subjects = ['All', 'Mathematics', 'Science'];
  
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hard':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };
  
  const getTopicInfo = (topicId) => {
    return topics.find(t => t.id === topicId);
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Learning Content
          </h1>
          <p className="text-base leading-relaxed text-slate-600">
            {profile?.level ? `Personalized content for ${profile.level} level` : 'Explore NCERT Class 10 topics'}
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filter by Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
                {difficultyLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedDifficulty(level)}
                    data-testid={`filter-difficulty-${level.toLowerCase()}`}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-sm transition-all
                      ${selectedDifficulty === level
                        ? 'bg-indigo-700 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filter by Subject
              </label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    data-testid={`filter-subject-${subject.toLowerCase()}`}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-sm transition-all
                      ${selectedSubject === subject
                        ? 'bg-teal-600 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }
                    `}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((content, index) => {
            const topicInfo = getTopicInfo(content.topicId);
            
            return (
              <div
                key={content.id}
                data-testid={`content-card-${index}`}
                className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="relative bg-gradient-to-br from-indigo-500 to-teal-500 h-40 flex items-center justify-center">
                  <Play size={48} className="text-white opacity-80 group-hover:scale-110 transition-transform" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(content.difficulty)}`}>
                      {content.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {topicInfo?.subject}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{content.duration}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {content.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {content.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {topicInfo?.name}
                    </span>
                    <button
                      data-testid={`watch-btn-${index}`}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center space-x-1"
                    >
                      <Play size={16} />
                      <span>Watch</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredContent.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={64} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg text-slate-500">No content found for the selected filters</p>
            <button
              onClick={() => {
                setSelectedDifficulty('All');
                setSelectedSubject('All');
              }}
              className="mt-4 rounded-lg px-6 py-2 font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningContentPage;
