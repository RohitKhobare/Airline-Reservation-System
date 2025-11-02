import React, { useState } from 'react';
import { useExam } from '../../contexts/ExamContext';
import { X, Plus, Trash2 } from 'lucide-react';

interface CreateExamFormProps {
  onClose: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  type: 'multiple-choice' | 'true-false';
}

const CreateExamForm: React.FC<CreateExamFormProps> = ({ onClose }) => {
  const { addExam } = useExam();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      type: 'multiple-choice'
    }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        type: 'multiple-choice'
      }
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    if (field === 'type' && value === 'true-false') {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
        options: ['True', 'False'],
        correctAnswer: 0
      };
    } else if (field === 'type' && value === 'multiple-choice') {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
        options: ['', '', '', ''],
        correctAnswer: 0
      };
    } else {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value
      };
    }
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.question.trim()) {
        alert(`Please enter question text for question ${i + 1}`);
        return;
      }
      
      if (question.type === 'multiple-choice') {
        const filledOptions = question.options.filter(opt => opt.trim());
        if (filledOptions.length < 2) {
          alert(`Please provide at least 2 options for question ${i + 1}`);
          return;
        }
      }
    }

    const examData = {
      title: title.trim(),
      description: description.trim(),
      duration,
      totalMarks: questions.length * 10, // 10 marks per question
      questions: questions.map((q, index) => ({
        id: `q${Date.now()}_${index}`,
        question: q.question.trim(),
        options: q.options.filter(opt => opt.trim()),
        correctAnswer: q.correctAnswer,
        type: q.type
      }))
    };

    addExam(examData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Exam</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Exam Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter exam title"
                required
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="240"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Enter exam description"
              required
            />
          </div>

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Questions</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((question, questionIndex) => (
                <div key={questionIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">
                      Question {questionIndex + 1}
                    </h4>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Type
                      </label>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(questionIndex, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                        placeholder="Enter your question"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name={`correct-${questionIndex}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                              className="text-blue-600"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Option ${optionIndex + 1}`}
                              readOnly={question.type === 'true-false'}
                            />
                            {question.correctAnswer === optionIndex && (
                              <span className="text-green-600 text-sm font-medium">Correct</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Create Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamForm;