import React, { createContext, useContext, useState, useEffect } from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  type: 'multiple-choice' | 'true-false';
}

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questions: Question[];
  totalMarks: number;
}

interface ExamResult {
  id: string;
  examId: string;
  userId: string;
  answers: { [questionId: string]: number };
  score: number;
  totalQuestions: number;
  completedAt: Date;
  timeTaken: number; // in minutes
}

interface ExamContextType {
  exams: Exam[];
  results: ExamResult[];
  addExam: (exam: Omit<Exam, 'id'>) => void;
  submitExamResult: (result: Omit<ExamResult, 'id'>) => void;
  getExamById: (id: string) => Exam | undefined;
  getUserResults: (userId: string) => ExamResult[];
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const useExam = () => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedExams = localStorage.getItem('examSystem_exams');
    const savedResults = localStorage.getItem('examSystem_results');
    
    if (savedExams) {
      setExams(JSON.parse(savedExams));
    } else {
      // Initialize with sample exams
      const sampleExams: Exam[] = [
        {
          id: '1',
          title: 'JavaScript Fundamentals',
          description: 'Test your knowledge of JavaScript basics',
          duration: 30,
          totalMarks: 50,
          questions: [
            {
              id: 'q1',
              question: 'Which of the following is NOT a JavaScript data type?',
              options: ['String', 'Boolean', 'Float', 'Undefined'],
              correctAnswer: 2,
              type: 'multiple-choice'
            },
            {
              id: 'q2',
              question: 'JavaScript is a case-sensitive language.',
              options: ['True', 'False'],
              correctAnswer: 0,
              type: 'true-false'
            },
            {
              id: 'q3',
              question: 'What does DOM stand for?',
              options: ['Document Object Model', 'Data Object Management', 'Dynamic Object Manipulation', 'Document Oriented Markup'],
              correctAnswer: 0,
              type: 'multiple-choice'
            },
            {
              id: 'q4',
              question: 'Which method is used to add an element at the end of an array?',
              options: ['push()', 'pop()', 'shift()', 'unshift()'],
              correctAnswer: 0,
              type: 'multiple-choice'
            },
            {
              id: 'q5',
              question: 'The === operator performs type coercion.',
              options: ['True', 'False'],
              correctAnswer: 1,
              type: 'true-false'
            }
          ]
        },
        {
          id: '2',
          title: 'React.js Basics',
          description: 'Fundamentals of React development',
          duration: 45,
          totalMarks: 60,
          questions: [
            {
              id: 'q6',
              question: 'What is JSX?',
              options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Extended', 'JavaScript Extension'],
              correctAnswer: 0,
              type: 'multiple-choice'
            },
            {
              id: 'q7',
              question: 'React components must return a single root element.',
              options: ['True', 'False'],
              correctAnswer: 1,
              type: 'true-false'
            },
            {
              id: 'q8',
              question: 'Which hook is used for state management in functional components?',
              options: ['useEffect', 'useState', 'useContext', 'useRef'],
              correctAnswer: 1,
              type: 'multiple-choice'
            }
          ]
        }
      ];
      setExams(sampleExams);
      localStorage.setItem('examSystem_exams', JSON.stringify(sampleExams));
    }
    
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  const addExam = (exam: Omit<Exam, 'id'>) => {
    const newExam = { ...exam, id: Date.now().toString() };
    const updatedExams = [...exams, newExam];
    setExams(updatedExams);
    localStorage.setItem('examSystem_exams', JSON.stringify(updatedExams));
  };

  const submitExamResult = (result: Omit<ExamResult, 'id'>) => {
    const newResult = { ...result, id: Date.now().toString() };
    const updatedResults = [...results, newResult];
    setResults(updatedResults);
    localStorage.setItem('examSystem_results', JSON.stringify(updatedResults));
  };

  const getExamById = (id: string) => {
    return exams.find(exam => exam.id === id);
  };

  const getUserResults = (userId: string) => {
    return results.filter(result => result.userId === userId);
  };

  return (
    <ExamContext.Provider value={{
      exams,
      results,
      addExam,
      submitExamResult,
      getExamById,
      getUserResults
    }}>
      {children}
    </ExamContext.Provider>
  );
};