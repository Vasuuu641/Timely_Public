import { useState, useEffect } from 'react';
import { createQuiz, updateQuiz, deleteQuiz, type CreateQuizDto, type Quiz as QuizType } from '../../api/quiz';
import { Plus, Trash2 } from 'lucide-react';

interface GenerateQuizProps {
  onQuizCreated: () => void;
  onClose: () => void;
  editingQuizTitle?: string;
  editingQuizzes?: QuizType[];
}

const GenerateQuiz = ({ onQuizCreated, onClose, editingQuizTitle, editingQuizzes }: GenerateQuizProps) => {
  const isEditing = !!editingQuizTitle && editingQuizzes && editingQuizzes.length > 0;
  const [formData, setFormData] = useState({
    title: isEditing && editingQuizzes ? editingQuizzes[0].title : '',
    topic: isEditing && editingQuizzes ? editingQuizzes[0].topic : '',
    numQuestions: isEditing && editingQuizzes ? editingQuizzes.length : 10,
    difficulty: 'Medium',
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<(CreateQuizDto & { id?: string })[]>(
    isEditing && editingQuizzes ? editingQuizzes : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'questions'>(isEditing ? 'questions' : 'form');

  useEffect(() => {
    if (isEditing && editingQuizzes) {
      setFormData({
        title: editingQuizzes[0].title,
        topic: editingQuizzes[0].topic,
        numQuestions: editingQuizzes.length,
        difficulty: 'Medium',
      });
      setQuizQuestions(editingQuizzes);
      setStep('questions');
      setCurrentQuestion(0);
    }
  }, [isEditing, editingQuizzes]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numQuestions' ? parseInt(value) : value,
    }));
  };

  const handleGenerateQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.topic.trim()) {
      alert('Please fill in all fields');
      return;
    }
    // Initialize empty questions based on number selected
    const emptyQuestions: CreateQuizDto[] = Array(formData.numQuestions).fill(null).map(() => ({
      title: formData.title,
      topic: formData.topic,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    }));
    setQuizQuestions(emptyQuestions);
    setStep('questions');
    setCurrentQuestion(0);
  };

  const handleQuestionChange = (field: string, value: any) => {
    const updated = [...quizQuestions];
    if (field === 'question') {
      updated[currentQuestion].question = value;
    } else if (field === 'option') {
      // value comes as { index, text }
      const oldOptionText = updated[currentQuestion].options[value.index];
      updated[currentQuestion].options[value.index] = value.text;
      
      // If the old option was the correct answer, update it to the new text
      if (updated[currentQuestion].correctAnswer === oldOptionText) {
        updated[currentQuestion].correctAnswer = value.text;
      }
    } else if (field === 'correctAnswer') {
      updated[currentQuestion].correctAnswer = value;
    }
    setQuizQuestions(updated);
  };

  const handleNextQuestion = () => {
    if (!quizQuestions[currentQuestion].question.trim()) {
      alert('Please enter the question');
      return;
    }
    if (quizQuestions[currentQuestion].options.some(opt => !opt.trim())) {
      alert('Please fill in all options');
      return;
    }
    if (!quizQuestions[currentQuestion].correctAnswer) {
      alert('Please select the correct answer');
      return;
    }
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: CreateQuizDto & { id?: string } = {
      title: formData.title,
      topic: formData.topic,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    };
    setQuizQuestions([...quizQuestions, newQuestion]);
  };

  const handleDeleteQuestion = async () => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    const question = quizQuestions[currentQuestion];
    
    // If it has an id, delete from backend
    if (question.id) {
      try {
        await deleteQuiz(question.id);
      } catch (err) {
        console.error('Failed to delete question:', err);
        alert('Failed to delete question. Please try again.');
        return;
      }
    }

    // Remove from local state
    const updated = quizQuestions.filter((_, idx) => idx !== currentQuestion);
    setQuizQuestions(updated);
    
    // Adjust current question index
    if (currentQuestion >= updated.length && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    // Validate last question
    if (!quizQuestions[currentQuestion].question.trim()) {
      alert('Please enter the question');
      return;
    }
    if (quizQuestions[currentQuestion].options.some(opt => !opt.trim())) {
      alert('Please fill in all options');
      return;
    }
    if (!quizQuestions[currentQuestion].correctAnswer) {
      alert('Please select the correct answer');
      return;
    }

    // Final validation: ensure correctAnswer is in options for all questions
    for (let i = 0; i < quizQuestions.length; i++) {
      const q = quizQuestions[i];
      if (!q.options.includes(q.correctAnswer)) {
        alert(`Question ${i + 1}: The correct answer must be one of the options. Please review.`);
        setCurrentQuestion(i);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Process each question
      for (let i = 0; i < quizQuestions.length; i++) {
        const quiz = quizQuestions[i];
        
        if (quiz.id) {
          // Update existing question
          console.log('Updating quiz:', quiz);
          try {
            await updateQuiz(quiz.id, {
              question: quiz.question,
              options: quiz.options,
              correctAnswer: quiz.correctAnswer,
            });
          } catch (err) {
            console.error(`Failed to update question ${i + 1}:`, err);
            throw new Error(`Failed to update question ${i + 1}. ${err instanceof Error ? err.message : ''}`);
          }
        } else {
          // Create new question (added during edit)
          console.log('Creating new quiz question:', quiz);
          try {
            await createQuiz(quiz);
          } catch (err) {
            console.error(`Failed to create question ${i + 1}:`, err);
            throw new Error(`Failed to create question ${i + 1}. ${err instanceof Error ? err.message : ''}`);
          }
        }
      }
      
      alert(isEditing ? 'Quiz updated successfully!' : 'Quiz created successfully!');
      onQuizCreated();
      onClose();
    } catch (error) {
      console.error('Failed to save quiz:', error);
      alert(`Failed to save quiz. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'form') {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{isEditing ? 'Edit Quiz' : 'Generate New Quiz'}</h2>
            <p>{isEditing ? 'Update your quiz questions' : 'Create a custom quiz with AI-generated questions'}</p>
          </div>

          <form onSubmit={handleGenerateQuestions}>
            <div className="form-group">
              <label>Quiz Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Physics - Quantum Mechanics"
                value={formData.title}
                onChange={handleFormChange}
                disabled={isEditing}
              />
            </div>

            <div className="form-group">
              <label>Subject/Topic</label>
              <input
                type="text"
                name="topic"
                placeholder="e.g., Quantum Physics, Chapter 5"
                value={formData.topic}
                onChange={handleFormChange}
                disabled={isEditing}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Number of Questions</label>
                <select
                  name="numQuestions"
                  value={formData.numQuestions}
                  onChange={handleFormChange}
                  disabled={isEditing}
                >
                  {[5, 10, 15, 20].map(num => (
                    <option key={num} value={num}>{num} Questions</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleFormChange}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {!isEditing && (
              <div className="form-note">
                <strong>Note:</strong> This is a demo. In the full version, AI will generate custom questions based on your topic and difficulty level.
              </div>
            )}

            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-generate">
                {isEditing ? 'Edit Questions' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const selectedOption = question.correctAnswer;

  return (
    <div className="modal-overlay">
      <div className="modal-content question-modal">
        <div className="question-header">
          <h2>Question {currentQuestion + 1} of {quizQuestions.length}</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="question-form">
          <div className="form-group">
            <label>Question</label>
            <textarea
              placeholder="Enter the question"
              value={question.question}
              onChange={(e) => handleQuestionChange('question', e.target.value)}
              rows={3}
            />
          </div>

          <div className="options-section">
            <label>Options</label>
            {question.options.map((option, idx) => (
              <div key={idx} className="option-input">
                <input
                  type="radio"
                  name="correctAnswer"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleQuestionChange('correctAnswer', option)}
                  disabled={!option}
                />
                <input
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={option}
                  onChange={(e) => handleQuestionChange('option', { index: idx, text: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="question-actions">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="btn-prev"
          >
            Previous
          </button>
          <span className="question-counter">
            {currentQuestion + 1} / {quizQuestions.length}
          </span>
          <div className="question-management">
            {isEditing && (
              <button
                onClick={handleDeleteQuestion}
                className="btn-delete-question"
                title="Delete this question"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={handleAddQuestion}
              className="btn-add-question"
              title="Add a new question"
            >
              <Plus size={16} />
            </button>
          </div>
          {currentQuestion < quizQuestions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              className="btn-next"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className="btn-submit"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateQuiz;
