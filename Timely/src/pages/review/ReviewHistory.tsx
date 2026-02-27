import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Navbar/Sidebar";
import {
  getReviewHistory,
  updateReview,
  deleteReview,
  type DailyReview,
} from "../../api/review";
import "./ReviewHistory.css";

const ReviewHistory = () => {
  const email = localStorage.getItem("userEmail") ?? undefined;
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<DailyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editReflection, setEditReflection] = useState("");
  const [editRating, setEditRating] = useState<number | null>(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const take = 10;

  const loadReviews = async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      const currentSkip = reset ? 0 : skip;
      const data = await getReviewHistory(currentSkip, take);
      
      if (reset) {
        setReviews(data);
        setSkip(take);
      } else {
        setReviews((prev) => [...prev, ...data]);
        setSkip((prev) => prev + take);
      }
      
      setHasMore(data.length === take);
    } catch (err: any) {
      console.error("Error loading review history:", err);
      setError(err.message || "Failed to load review history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews(true);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getMoodEmoji = (rating: number | null) => {
    if (rating === 3) return "😊";
    if (rating === 2) return "😐";
    if (rating === 1) return "😟";
    return "❓";
  };

  const getMoodLabel = (rating: number | null) => {
    if (rating === 3) return "Great";
    if (rating === 2) return "Okay";
    if (rating === 1) return "Challenging";
    return "Not rated";
  };

  const handleEdit = (review: DailyReview) => {
    setEditingId(review.id);
    setEditReflection(review.reflection);
    setEditRating(review.rating);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditReflection("");
    setEditRating(null);
  };

  const handleSaveEdit = async (id: number) => {
    if (!editReflection.trim()) {
      alert("Reflection cannot be empty");
      return;
    }

    try {
      const updateData: { reflection: string; rating?: number } = {
        reflection: editReflection,
      };
      
      if (editRating !== null) {
        updateData.rating = editRating;
      }
      
      const updated = await updateReview(id, updateData);

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
      setEditingId(null);
      setEditReflection("");
      setEditRating(null);
    } catch (err: any) {
      console.error("Update error:", err);
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to update review";
      alert(Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete review");
    }
  };

  const loadMore = () => {
    loadReviews(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar userEmail={email} />

      <main className="review-history-container">
        <header className="review-history-header">
          <div>
            <h1>Review History</h1>
            <p>View and manage your past daily reflections</p>
          </div>
          <button className="back-btn" onClick={() => navigate("/review")}>
            ← Back to Today's Review
          </button>
        </header>

        {error && <p className="error-message">{error}</p>}

        {loading && reviews.length === 0 ? (
          <p>Loading review history...</p>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            <p>No past reviews found. Start by creating your first daily review!</p>
            <button className="primary-btn" onClick={() => navigate("/review")}>
              Create Today's Review
            </button>
          </div>
        ) : (
          <>
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-card-header">
                    <div className="review-date-section">
                      <h3>{formatDate(review.date)}</h3>
                      <div className="review-mood">
                        <span className="mood-emoji">
                          {getMoodEmoji(review.rating)}
                        </span>
                        <span className="mood-label">
                          {getMoodLabel(review.rating)}
                        </span>
                      </div>
                    </div>
                    {editingId !== review.id && (
                      <div className="review-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(review)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(review.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {editingId === review.id ? (
                    <div className="edit-form">
                      <div className="edit-mood">
                        <label>Mood:</label>
                        <div className="mood-buttons">
                          <button
                            className={`mood-btn ${editRating === 3 ? "active" : ""}`}
                            onClick={() => setEditRating(3)}
                          >
                            😊 Great
                          </button>
                          <button
                            className={`mood-btn ${editRating === 2 ? "active" : ""}`}
                            onClick={() => setEditRating(2)}
                          >
                            😐 Okay
                          </button>
                          <button
                            className={`mood-btn ${editRating === 1 ? "active" : ""}`}
                            onClick={() => setEditRating(1)}
                          >
                            😟 Challenging
                          </button>
                        </div>
                      </div>
                      <textarea
                        className="edit-textarea"
                        value={editReflection}
                        onChange={(e) => setEditReflection(e.target.value)}
                        rows={6}
                      />
                      <div className="edit-actions">
                        <button
                          className="save-btn"
                          onClick={() => handleSaveEdit(review.id)}
                        >
                          Save Changes
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="review-reflection">
                      <p>{review.reflection}</p>
                    </div>
                  )}

                  <div className="review-meta">
                    <span>
                      Created: {new Date(review.createdAt).toLocaleString()}
                    </span>
                    {review.updatedAt !== review.createdAt && (
                      <span>
                        Updated: {new Date(review.updatedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="load-more-section">
                <button
                  className="load-more-btn"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ReviewHistory;
