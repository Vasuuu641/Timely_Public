import "./Notes.css";
import SearchInput from "../../components/Notes/SearchInput";
import NoteCard from "../../components/Notes/NoteCard";
import Sidebar from "../../components/Navbar/Sidebar";
import { useEffect, useState } from "react";
import { fetchNotes, fetchCategories, createNote, updateNote, createCategory, type Note, type CreateNoteDto } from "../../api/notes";
import { Plus, X } from "lucide-react";

type ModalMode = 'create' | 'edit' | 'view' | null;

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState<CreateNoteDto>({
    title: "",
    content: "",
    category: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = localStorage.getItem("userEmail") ?? undefined;

  useEffect(() => {
    loadNotes();
    loadCategories();
  }, []);

  useEffect(() => {
    // Filter notes based on search query
    if (!search.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const query = search.toLowerCase();
    const filtered = notes.filter(note => 
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.category.name.toLowerCase().includes(query) ||
      note.tags.some(t => t.tag.name.toLowerCase().includes(query))
    );
    setFilteredNotes(filtered);
  }, [search, notes]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await fetchNotes();
      setNotes(data);
      setFilteredNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      if (data.length === 0) {
        console.warn('No categories found. Creating default categories...');
        // Create default categories
        const defaultCategories = ['Physics', 'Math', 'Chemistry', 'Biology', 'History', 'General'];
        for (const catName of defaultCategories) {
          try {
            await createCategory(catName);
          } catch (err) {
            console.error(`Failed to create category ${catName}:`, err);
          }
        }
        // Reload categories after creating defaults
        const newData = await fetchCategories();
        setCategories(newData);
      } else {
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const openCreateModal = () => {
    setFormData({
      title: "",
      content: "",
      category: "",
      tags: [],
    });
    setTagInput("");
    setSelectedNote(null);
    setModalMode('create');
  };

  const openViewModal = (note: Note) => {
    setSelectedNote(note);
    setModalMode('view');
  };

  const openEditModal = (note: Note) => {
    setSelectedNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category.id,
      tags: note.tags.map(t => t.tag.name),
    });
    setTagInput("");
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedNote(null);
    setFormData({
      title: "",
      content: "",
      category: "",
      tags: [],
    });
    setTagInput("");
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData({ 
        ...formData, 
        tags: [...(formData.tags || []), tag] 
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting note data:', formData);
      if (modalMode === 'create') {
        await createNote(formData);
      } else if (modalMode === 'edit' && selectedNote) {
        await updateNote(selectedNote.id, formData);
      }
      await loadNotes();
      closeModal();
    } catch (error) {
      console.error(`Failed to ${modalMode} note:`, error);
      alert(`Failed to ${modalMode} note. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNoteDeleted = () => {
    loadNotes();
  };

  return (
    <div className="notes-layout">
      <Sidebar userEmail={email} />
      
      <div className="notes-content">
        <div className="notes-page">
          <div className="notes-header">
            <h1 className="notes-title">Notes</h1>
            <p className="notes-subtitle">
              Capture, organize, and manage your study notes
            </p>
          </div>

          <div className="notes-toolbar">
            <SearchInput value={search} onChange={setSearch} />
            <button className="new-note-btn" onClick={openCreateModal}>
              <Plus size={20} />
              New Note
            </button>
          </div>

          {loading ? (
            <div className="notes-loading">Loading notes...</div>
          ) : filteredNotes.length === 0 ? (
            <div className="notes-empty">
              {search ? "No notes found matching your search" : "No notes yet. Create your first note!"}
            </div>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note}
                  onView={() => openViewModal(note)}
                  onEdit={() => openEditModal(note)}
                  onDelete={handleNoteDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View Note Modal */}
      {modalMode === 'view' && selectedNote && (
        <div className="note-modal-overlay" onClick={closeModal}>
          <div className="note-modal" onClick={(e) => e.stopPropagation()}>
            <div className="note-modal-header">
              <h2 className="note-modal-title">{selectedNote.title}</h2>
              <button className="note-modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <div className="note-modal-body">
              <div className="note-view-meta">
                <span className="note-category-badge">{selectedNote.category.name}</span>
                <span className="note-date">
                  {new Date(selectedNote.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {selectedNote.tags.length > 0 && (
                <div className="note-view-tags">
                  {selectedNote.tags.map((t) => (
                    <span key={t.tag.id} className="note-tag">
                      {t.tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="note-view-content">
                {selectedNote.content}
              </div>

              <div className="note-form-actions">
                <button
                  type="button"
                  className="note-form-btn note-form-btn-submit"
                  onClick={() => openEditModal(selectedNote)}
                >
                  Edit Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Note Modal */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="note-modal-overlay" onClick={closeModal}>
          <div className="note-modal" onClick={(e) => e.stopPropagation()}>
            <div className="note-modal-header">
              <h2 className="note-modal-title">
                {modalMode === 'create' ? 'Create New Note' : 'Edit Note'}
              </h2>
              <button className="note-modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <div className="note-modal-body">
              <form className="note-form" onSubmit={handleSubmit}>
                <div className="note-form-group">
                  <label className="note-form-label">Title *</label>
                  <input
                    type="text"
                    className="note-form-input"
                    placeholder="Enter note title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="note-form-group">
                  <label className="note-form-label">Category *</label>
                  <select
                    className="note-form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    disabled={categories.length === 0}
                  >
                    <option value="">
                      {categories.length === 0 ? 'Loading categories...' : 'Select a category'}
                    </option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <span style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                      Creating default categories, please wait...
                    </span>
                  )}
                </div>

                <div className="note-form-group">
                  <label className="note-form-label">Content *</label>
                  <textarea
                    className="note-form-textarea"
                    placeholder="Write your note content here..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>

                <div className="note-form-group">
                  <label className="note-form-label">Tags (Optional)</label>
                  <div className="tag-input-container">
                    <input
                      type="text"
                      className="note-form-input"
                      placeholder="Add a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                    />
                    <button
                      type="button"
                      className="tag-add-btn"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="tags-list">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="tag-item">
                          {tag}
                          <button
                            type="button"
                            className="tag-remove-btn"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="note-form-actions">
                  <button
                    type="button"
                    className="note-form-btn note-form-btn-cancel"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="note-form-btn note-form-btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? (modalMode === 'create' ? 'Creating...' : 'Updating...') 
                      : (modalMode === 'create' ? 'Create Note' : 'Update Note')
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;

