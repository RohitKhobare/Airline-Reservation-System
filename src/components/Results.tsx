import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useExam } from '../contexts/ExamContext';
import { ArrowLeft, Calendar, Clock, Award, BookOpen, TrendingUp } from 'lucide-react';

const Results: React.FC = () => {
  const { user } = useAuth();
  const { getUserResults, getExamById } = useExam();
  const navigate = useNavigate();

  const userResults = user ? getUserResults(user.id) : [];

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    return 'F';
  };

  const averageScore = userResults.length > 0
    ? userResults.reduce((acc, result) => acc + (result.score / result.totalQuestions) * 100, 0) / userResults.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Exam Results</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{userResults.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(averageScore)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userResults.length > 0
                    ? Math.round(Math.max(...userResults.map(r => (r.score / r.totalQuestions) * 100)))
                    : 0}%
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Detailed Results</h2>
          </div>
          <div className="p-6">
            {userResults.length === 0 ? (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No exam results yet</p>
                <p className="text-sm text-gray-400 mt-2">Take some exams to see your results here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userResults
                  .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                  .map((result) => {
                    const exam = getExamById(result.examId);
                    const percentage = (result.score / result.totalQuestions) * 100;
                    const grade = getGrade(percentage);
                    const gradeColorClass = getGradeColor(percentage);

                    return (
                      <div key={result.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {exam?.title || 'Unknown Exam'}
                            </h3>
                            <p className="text-gray-600 text-sm">{exam?.description}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${gradeColorClass}`}>
                            Grade: {grade}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Score</p>
                              <p className="font-medium">{result.score}/{result.totalQuestions}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Percentage</p>
                              <p className="font-medium">{Math.round(percentage)}%</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Time Taken</p>
                              <p className="font-medium">{Math.round(result.timeTaken)} min</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Completed</p>
                              <p className="font-medium">
                                {new Date(result.completedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Performance</span>
                            <span>{Math.round(percentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                percentage >= 80 ? 'bg-green-500' :
                                percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;