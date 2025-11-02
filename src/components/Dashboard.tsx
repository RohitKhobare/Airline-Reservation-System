import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useExam } from '../contexts/ExamContext';
import { BookOpen, Clock, Users, Award, LogOut, Settings, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { exams, getUserResults } = useExam();
  const navigate = useNavigate();

  const userResults = user ? getUserResults(user.id) : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartExam = (examId: string) => {
    navigate(`/exam/${examId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Examination System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin Panel</span>
                </button>
              )}
              <button
                onClick={() => navigate('/results')}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Results</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Exams</p>
                <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Exams</p>
                <p className="text-2xl font-bold text-gray-900">{userResults.length}</p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userResults.length > 0
                    ? Math.round(userResults.reduce((acc, result) => acc + (result.score / result.totalQuestions) * 100, 0) / userResults.length)
                    : 0}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Available Exams */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Available Exams</h2>
          </div>
          <div className="p-6">
            {exams.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No exams available at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => {
                  const hasCompleted = userResults.some(result => result.examId === exam.id);
                  return (
                    <div key={exam.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{exam.description}</p>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{exam.duration} minutes</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{exam.questions.length} questions</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Award className="w-4 h-4 mr-2" />
                          <span>{exam.totalMarks} marks</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartExam(exam.id)}
                        disabled={hasCompleted}
                        className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                          hasCompleted
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {hasCompleted ? 'Completed' : 'Start Exam'}
                      </button>
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

export default Dashboard;