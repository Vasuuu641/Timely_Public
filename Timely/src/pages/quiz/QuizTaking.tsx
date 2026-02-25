import { useState } from 'react';
import { type Quiz } from '../../api/quiz';
import { ChevronRight } from 'lucide-react';

interface QuizTakingProps {
  quizzes: Quiz[];
  onBack: () => void;
}

const QuizTaking = ({ quizzes, onBack }: QuizTakingProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: string | null }>({});

  const currentQuiz = quizzes[currentQuestion];

  const handleSelectAnswer = (option: string) => {
    if (!answered) {
      setSelectedAnswer(option);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      alert('Please select an answer');
      return;
    }

    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: selectedAnswer,
    }));

    if (selectedAnswer === currentQuiz.correctAnswer) {
      setScore(prev => prev + 1);
    }

    setAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizzes.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const calculatePercentage = () => {
    return Math.round((score / quizzes.length) * 100);
  };

  const getScoreColor = () => {
    const percentage = calculatePercentage();
    if (percentage >= 80) return '#0A5C10'; // dark green
    if (percentage >= 60) return '#e65100'; // orange
    return '#c62828'; // red
  };

  if (showResults) {
    const percentage = calculatePercentage();
    const quizTitle = quizzes[0]?.title || 'Quiz';
    
    // Save score to localStorage
    const existingScores = JSON.parse(localStorage.getItem('quizScores') || '{}');
    existingScores[quizTitle] = percentage;
    localStorage.setItem('quizScores', JSON.stringify(existingScores));
    
    return (
      <div className="quiz-results">
        <div className="results-card">
          <h2>Quiz Complete!</h2>
          <div className="score-circle" style={{ borderColor: getScoreColor() }}>
            <div className="score-text">
              <span className="score-number" style={{ color: getScoreColor() }}>{percentage}%</span>
              <span className="score-label">Score</span>
            </div>
          </div>
          <p className="results-message">
            You got <strong>{score} out of {quizzes.length}</strong> questions correct!
          </p>
          <div className="results-breakdown">
            {quizzes.map((quiz, idx) => (
              <div key={idx} className={`result-item ${answers[idx] === quiz.correctAnswer ? 'correct' : 'incorrect'}`}>
                <div className="result-question">
                  <span className="result-number">Q{idx + 1}</span>
                  <span className="result-text">{quiz.question}</span>
                </div>
                <div className="result-answer">
                  <span className="your-answer">Your answer: {answers[idx]}</span>
                  {answers[idx] !== quiz.correctAnswer && (
                    <span className="correct-answer">Correct: {quiz.correctAnswer}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button onClick={onBack} className="btn-back-results">
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-taking">
      <div className="quiz-header">
        <h2>{currentQuiz.topic}</h2>
        <div className="progress-info">
          Question {currentQuestion + 1} / {quizzes.length}
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentQuestion + 1) / quizzes.length) * 100}%` }}
        />
      </div>

      <div className="question-container">
        <h3 className="question-text">{currentQuiz.question}</h3>

        <div className="options-container">
          {currentQuiz.options.map((option) => (
            <button
              key={option}
              className={`option-button ${
                selectedAnswer === option ? 'selected' : ''
              } ${
                answered && option === currentQuiz.correctAnswer ? 'correct' : ''
              } ${
                answered && selectedAnswer === option && option !== currentQuiz.correctAnswer ? 'incorrect' : ''
              }`}
              onClick={() => handleSelectAnswer(option)}
              disabled={answered}
            >
              <div className="option-radio">
                {selectedAnswer === option && !answered && <div className="radio-inner" />}
                {answered && option === currentQuiz.correctAnswer && <div className="radio-check">✓</div>}
                {answered && selectedAnswer === option && option !== currentQuiz.correctAnswer && (
                  <div className="radio-cross">✗</div>
                )}
              </div>
              <span>{option}</span>
            </button>
          ))}
        </div>

        {answered && (
          <div className={`feedback ${selectedAnswer === currentQuiz.correctAnswer ? 'correct' : 'incorrect'}`}>
            {selectedAnswer === currentQuiz.correctAnswer
              ? '✓ Correct!'
              : `✗ Incorrect. The correct answer is: ${currentQuiz.correctAnswer}`}
          </div>
        )}
      </div>

      <div className="quiz-actions">
        {!answered ? (
          <button onClick={handleSubmitAnswer} className="btn-submit-answer">
            Submit Answer
          </button>
        ) : (
          <button onClick={handleNextQuestion} className="btn-next-question">
            {currentQuestion === quizzes.length - 1 ? 'See Results' : 'Next Question'} 
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTaking;
