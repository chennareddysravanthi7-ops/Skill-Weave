export const topics = [
  {
    id: 'math_algebra',
    name: 'Algebra',
    subject: 'Mathematics',
    difficulty: 'Medium',
    description: 'Quadratic Equations, Polynomials, Linear Equations',
    icon: 'Calculator',
  },
  {
    id: 'math_geometry',
    name: 'Geometry',
    subject: 'Mathematics',
    difficulty: 'Medium',
    description: 'Triangles, Circles, Areas and Volumes',
    icon: 'Triangle',
  },
  {
    id: 'math_trigonometry',
    name: 'Trigonometry',
    subject: 'Mathematics',
    difficulty: 'Hard',
    description: 'Trigonometric Ratios, Heights and Distances',
    icon: 'Ruler',
  },
  {
    id: 'math_statistics',
    name: 'Statistics',
    subject: 'Mathematics',
    difficulty: 'Easy',
    description: 'Mean, Median, Mode, Probability',
    icon: 'BarChart3',
  },
  {
    id: 'science_physics',
    name: 'Physics',
    subject: 'Science',
    difficulty: 'Medium',
    description: 'Light, Electricity, Magnetic Effects',
    icon: 'Zap',
  },
  {
    id: 'science_chemistry',
    name: 'Chemistry',
    subject: 'Science',
    difficulty: 'Medium',
    description: 'Chemical Reactions, Acids-Bases, Metals',
    icon: 'FlaskConical',
  },
  {
    id: 'science_biology',
    name: 'Biology',
    subject: 'Science',
    difficulty: 'Easy',
    description: 'Life Processes, Heredity, Evolution',
    icon: 'Leaf',
  },
  {
    id: 'science_environment',
    name: 'Environment',
    subject: 'Science',
    difficulty: 'Easy',
    description: 'Our Environment, Natural Resources',
    icon: 'Globe',
  },
];

export const getTopicById = (id) => {
  return topics.find(topic => topic.id === id);
};

export const getTopicsBySubject = (subject) => {
  return topics.filter(topic => topic.subject === subject);
};

export const getTopicsByDifficulty = (difficulty) => {
  return topics.filter(topic => topic.difficulty === difficulty);
};
