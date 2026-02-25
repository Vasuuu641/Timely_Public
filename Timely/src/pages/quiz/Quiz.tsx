import { useState, useEffect } from "react";
import Sidebar from "../../components/Navbar/Sidebar";
import GenerateQuiz from "./GenerateQuiz";
import QuizTaking from "./QuizTaking";
import { fetchAllQuizzes, deleteQuiz, type Quiz as QuizType } from "../../api/quiz";
import { Plus, Play, Trash2, Edit2 } from "lucide-react";
import "./Quiz.css";

type ViewMode = "list" | "taking" | "generating" | "editing";

const Quiz = () => {
  const email = localStorage.getItem("userEmail") ?? undefined;
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedQuizzes, setSelectedQuizzes] = useState<QuizType[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuizTitle, setEditingQuizTitle] = useState<string | null>(null);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});

  useEffect(() => {
    loadQuizzes();
    loadScores();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await fetchAllQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadScores = () => {
    const scores = localStorage.getItem("quizScores");
    if (scores) {
      setQuizScores(JSON.parse(scores));
    }
  };

  const handleStartQuiz = (quizTitle: string) => {
    // Get all questions for this quiz title
    const quizQuestions = quizzes.filter(q => q.title === quizTitle);
    setSelectedQuizzes(quizQuestions);
    setViewMode("taking");
  };

  const handleGenerateQuiz = async () => {
    await loadQuizzes();
    setShowGenerateModal(false);
  };

  const handleEditQuiz = (quizTitle: string) => {
    setEditingQuizTitle(quizTitle);
    setShowEditModal(true);
  };

  const handleQuizEdited = async () => {
    await loadQuizzes();
    setShowEditModal(false);
    setEditingQuizTitle(null);
  };

  const handleDeleteQuiz = async (quizTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${quizTitle}"? This will delete all questions in this quiz.`)) {
      return;
    }

    try {
      const quizesToDelete = quizzes.filter(q => q.title === quizTitle);
      await Promise.all(quizesToDelete.map(q => deleteQuiz(q.id)));
      await loadQuizzes();
      alert("Quiz deleted successfully");
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      alert("Failed to delete quiz");
    }
  };

  const handleBackFromTaking = () => {
    setViewMode("list");
    setSelectedQuizzes([]);
    loadQuizzes();
    loadScores();
  };

  // Group quizzes by title - each title represents one quiz with multiple questions
  const groupedQuizzes = quizzes.reduce((acc, quiz) => {
    const title = quiz.title;
    if (!acc[title]) {
      acc[title] = [];
    }
    acc[title].push(quiz);
    return acc;
  }, {} as Record<string, QuizType[]>);

  if (viewMode === "taking") {
    return (
      <div className="quiz-layout">
        <Sidebar userEmail={email} />
        <main className="quiz-main">
          <QuizTaking quizzes={selectedQuizzes} onBack={handleBackFromTaking} />
        </main>
      </div>
    );
  }

  return (
    <div className="quiz-layout">
      <Sidebar userEmail={email} />

      <main className="quiz-main">
        <div className="quiz-header-section">
          <div className="quiz-header-text">
            <h1 className="quiz-title">Quiz</h1>
            <p className="quiz-subtitle">Test your knowledge with AI-generated quizzes</p>
          </div>
          <button
            className="btn-generate-quiz"
            onClick={() => setShowGenerateModal(true)}
          >
            <Plus size={20} />
            Generate Quiz
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading quizzes...</div>
        ) : quizzes.length === 0 ? (
          <div className="empty-state">
            <p>No quizzes yet</p>
            <p className="empty-subtitle">Create your first quiz to get started</p>
            <button
              className="btn-generate-quiz"
              onClick={() => setShowGenerateModal(true)}
            >
              <Plus size={20} />
              Generate Quiz
            </button>
          </div>
        ) : (
          <div className="quizzes-container">
            {Object.entries(groupedQuizzes).map(([title, titleQuizzes]) => {
              const firstQuiz = titleQuizzes[0];
              const questionCount = titleQuizzes.length;
              const lastScore = quizScores[title];
              
              return (
                <div key={title} className="quiz-card-mini">
                  <div className="quiz-card-header-mini">
                    <h3 className="quiz-card-title-mini">{title}</h3>
                  </div>

                  <div className="quiz-card-meta-mini">
                    <p className="quiz-topic-mini">{firstQuiz.topic}</p>
                    <p className="meta-item-mini">Q: {questionCount}</p>
                    {lastScore !== undefined && <p className="meta-item-mini score">Score: {lastScore}%</p>}
                  </div>

                  <div className="quiz-card-actions-mini">
                    <button
                      className="btn-play-quiz"
                      onClick={() => handleStartQuiz(title)}
                      title="Start Quiz"
                    >
                      <Play size={14} />
                    </button>
                    <button
                      className="btn-edit-quiz"
                      onClick={() => handleEditQuiz(title)}
                      title="Edit Quiz"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn-delete-quiz"
                      onClick={() => handleDeleteQuiz(title)}
                      title="Delete Quiz"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showGenerateModal && (
          <GenerateQuiz
            onQuizCreated={handleGenerateQuiz}
            onClose={() => setShowGenerateModal(false)}
          />
        )}

        {showEditModal && editingQuizTitle && (
          <GenerateQuiz
            editingQuizTitle={editingQuizTitle}
            editingQuizzes={quizzes.filter(q => q.title === editingQuizTitle)}
            onQuizCreated={handleQuizEdited}
            onClose={() => {
              setShowEditModal(false);
              setEditingQuizTitle(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Quiz;