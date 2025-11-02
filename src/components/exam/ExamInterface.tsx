import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useExam } from '../../contexts/ExamContext';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const ExamInterface: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const { user } = useAuth();
  const { getExamById, submitExamResult } = useExam();
  const navigate = useNavigate();

  const exam = examId ? getExamById(examId) : null;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (exam) {
      setTimeLeft(exam.duration * 60); // Convert minutes to seconds
    }
  }, [exam]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (!exam) return;
    
    const questionId = exam.questions[currentQuestionIndex].id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitExam = () => {
    if (!exam || !user) return;

    setIsSubmitting(true);
    
    // Calculate score
    let score = 0;
    exam.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    const timeTaken = (exam.duration * 60 - timeLeft) / 60; // Convert back to minutes

    submitExamResult({
      examId: exam.id,
      userId: user.id,
      answers,
      score,
      totalQuestions: exam.questions.length,
      completedAt: new Date(),
      timeTaken
    });

    navigate('/results');
  };

  const getAnsweredQuestionsCount = () => {
    return Object.keys(answers).length;
  };

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Exam not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">
                  {getAnsweredQuestionsCount()} / {exam.questions.length} answered
                </span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${timeLeft < 300 ? 'text-red-600' : 'text-gray-600'}`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-2 bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-4">
              {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' : 'True/False'}
            </span>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  answers[currentQuestion.id] === index
                    ? 'bg-blue-50 border-blue-300 text-blue-900'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    answers[currentQuestion.id] === index
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion.id] === index && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex space-x-4">
            {currentQuestionIndex < exam.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmDialog(true)}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Question Navigation</h3>
          <div className="grid grid-cols-10 gap-2">
            {exam.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[exam.questions[index].id] !== undefined
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900">Submit Exam</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your exam? You have answered {getAnsweredQuestionsCount()} out of {exam.questions.length} questions.
              This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamInterface;