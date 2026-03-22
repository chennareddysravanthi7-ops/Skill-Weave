const STORAGE_KEYS = {
  STUDENT_PROFILE: 'student_profile',
  QUIZ_HISTORY: 'quiz_history',
  WEAK_TOPICS: 'weak_topics',
  PROGRESS: 'progress',
};

export const initializeStudent = (name) => {
  const profile = {
    id: Date.now().toString(),
    name: name || 'Student',
    level: null,
    confidence: 0,
    createdAt: new Date().toISOString(),
  };
  
  const progress = {
    totalQuizzes: 0,
    averageScore: 0,
    streak: 0,
    lastQuizDate: null,
  };
  
  localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(profile));
  localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.WEAK_TOPICS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  
  return profile;
};

export const getStudentProfile = () => {
  const profile = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
  return profile ? JSON.parse(profile) : null;
};

export const updateStudentProfile = (updates) => {
  const profile = getStudentProfile();
  const updated = { ...profile, ...updates };
  localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(updated));
  return updated;
};

export const getQuizHistory = () => {
  const history = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
  return history ? JSON.parse(history) : [];
};

export const addQuizResult = (quizResult) => {
  const history = getQuizHistory();
  history.push({
    ...quizResult,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));
  
  updateProgress(quizResult);
  updateWeakTopics(quizResult);
  
  return history;
};

export const getProgress = () => {
  const progress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return progress ? JSON.parse(progress) : {
    totalQuizzes: 0,
    averageScore: 0,
    streak: 0,
    lastQuizDate: null,
  };
};

const updateProgress = (quizResult) => {
  const progress = getProgress();
  const history = getQuizHistory();
  
  const totalScore = history.reduce((sum, q) => sum + q.score, 0);
  const averageScore = history.length > 0 ? Math.round(totalScore / history.length) : 0;
  
  const today = new Date().toDateString();
  const lastQuizDay = progress.lastQuizDate ? new Date(progress.lastQuizDate).toDateString() : null;
  
  let streak = progress.streak;
  if (lastQuizDay === today) {
    streak = progress.streak;
  } else if (lastQuizDay && new Date(today).getTime() - new Date(lastQuizDay).getTime() === 86400000) {
    streak += 1;
  } else {
    streak = 1;
  }
  
  const updated = {
    totalQuizzes: history.length,
    averageScore,
    streak,
    lastQuizDate: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(updated));
};

export const getWeakTopics = () => {
  const topics = localStorage.getItem(STORAGE_KEYS.WEAK_TOPICS);
  return topics ? JSON.parse(topics) : [];
};

const updateWeakTopics = (quizResult) => {
  if (!quizResult.incorrectTopics || quizResult.incorrectTopics.length === 0) return;
  
  const weakTopics = getWeakTopics();
  
  quizResult.incorrectTopics.forEach(topicId => {
    const existing = weakTopics.find(t => t.topicId === topicId);
    if (existing) {
      existing.errorCount += 1;
    } else {
      weakTopics.push({
        topicId,
        topicName: getTopicName(topicId),
        errorCount: 1,
      });
    }
  });
  
  weakTopics.sort((a, b) => b.errorCount - a.errorCount);
  const top5 = weakTopics.slice(0, 5);
  
  localStorage.setItem(STORAGE_KEYS.WEAK_TOPICS, JSON.stringify(top5));
};

const getTopicName = (topicId) => {
  const topics = {
    'math_algebra': 'Algebra',
    'math_geometry': 'Geometry',
    'math_trigonometry': 'Trigonometry',
    'math_statistics': 'Statistics',
    'science_physics': 'Physics',
    'science_chemistry': 'Chemistry',
    'science_biology': 'Biology',
    'science_environment': 'Environment',
  };
  return topics[topicId] || 'Unknown Topic';
};

export const classifyStudentLevel = (score) => {
  if (score < 40) return 'Easy';
  if (score <= 70) return 'Medium';
  return 'Hard';
};

export const calculateConfidence = (history) => {
  if (history.length === 0) return 0;
  
  const recentQuizzes = history.slice(-5);
  const recentAverage = recentQuizzes.reduce((sum, q) => sum + q.score, 0) / recentQuizzes.length;
  
  const consistency = recentQuizzes.reduce((sum, q, idx, arr) => {
    if (idx === 0) return sum;
    return sum + Math.abs(arr[idx].score - arr[idx - 1].score);
  }, 0) / (recentQuizzes.length - 1 || 1);
  
  const confidenceScore = Math.max(0, Math.min(100, recentAverage - consistency));
  
  return Math.round(confidenceScore);
};

export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
